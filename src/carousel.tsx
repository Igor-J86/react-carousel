import React, { useEffect, useRef, useState, Children, act, ReactElement } from 'react';
import { ArrowLeft, ArrowRight } from './icons';

export type Carousel = {
  children: React.ReactNode;
  id?: string;
  cards?: number;
  width?: string;
  interval?: number;
  customClass?: string;
  scrollRightTitle?: string;
  scrollLeftTitle?: string;
  showButtons?: boolean;
  arrowColor?: string;
  arrowWidth?: number;
  showDots?: boolean;
  startAt?: number;
  bigThumbs?: boolean;
};

export type Style = {
  wrapper: object;
  carousel: object;
};

export const Carousel:React.FC<Carousel> = ({
  children,
  id = 'carousel',
  cards:propCards = 3,
  width = '1000px',
  interval = 2500,
  customClass,
  scrollRightTitle = 'Scroll right',
  scrollLeftTitle = 'Scroll left',
  showButtons = true,
  showDots = true,
  arrowColor,
  arrowWidth,
  bigThumbs = false,
}) => {
  const carousel = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState(propCards);
  const [activeDot, setActiveDot] = useState(0)
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    const getCardCount = () => {
      if (window === undefined || bigThumbs) return propCards;
      // You can customize this logic as needed
      return window.innerWidth > 900 ? propCards : window.innerWidth > 600 ? 2 : 1;
    };

    const handleResize = () => {
      setCards(getCardCount());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [propCards, bigThumbs]);

  const carouselStyle:Style = {
    wrapper: {
      maxWidth: width,
    },
    carousel: {
      gridAutoColumns: `calc((100% / ${bigThumbs ? 1 : cards}) - 12px)`,
    },
  };

  useEffect(() => {
    if (!carousel.current) return;
    
    const carouselEl = carousel.current;

    const allCards = Array.from(carouselEl.children);
    allCards.forEach((card) => {
      card.setAttribute('draggable', 'false');
      card.classList.add('card');
      card.classList.add('single-scroll');
      const hasTitle = Array.from(card.children).find((c) => c.localName === 'h1' || c.localName === 'h2');
      if (hasTitle) {
        card.setAttribute('data-title', hasTitle.textContent)
      }
      const hasImage = Array.from(card.children).find((c) => c.localName === 'img');
      if (hasImage) {
        hasImage.setAttribute('draggable', 'false');
        card.setAttribute('data-img-thumb', hasImage.getAttribute('src'))
      }
    });
    
    const firstCard = carouselEl.querySelector('.card') as HTMLDivElement;
    if (!firstCard) return;

    const firstCardWidth = firstCard.offsetWidth;

    if(showDots) {
      const idx = Math.round(carouselEl.scrollLeft / firstCardWidth);
      if(idx !== activeDot) {
        carouselEl.scrollLeft = firstCardWidth * activeDot
      }
    }

    // Generic recursive finder for first match
    function findFirst<T>(
      node: React.ReactNode,
      predicate: (el: React.ReactElement<any>) => T | undefined
    ): T | undefined {
      if (!node) return undefined;
      if (Array.isArray(node)) {
        for (const child of node) {
          const found = findFirst(child, predicate);
          if (found !== undefined) return found;
        }
      } else if (React.isValidElement(node)) {
        const el = node as React.ReactElement<any>;
        const result = predicate(el);
        if (result !== undefined) return result;
        return findFirst((el.props as any).children, predicate);
      }
      return undefined;
    }

    if (bigThumbs) {
      const thumbsArr: string[] = [];
      const titlesArr: string[] = [];
      Children.forEach(children, (child: any) => {
        thumbsArr.push(
          findFirst(child.props.children, el => {
            const elem = el as React.ReactElement<any>;
            return elem.type === 'img' && elem.props && elem.props.src ? elem.props.src : undefined;
          }) || ''
        );
        titlesArr.push(
          findFirst(child.props.children, el => {
            const elem = el as React.ReactElement<any>;
            if ((elem.type === 'h1' || elem.type === 'h2') && elem.props && elem.props.children) {
              if (typeof elem.props.children === 'string') return elem.props.children;
              if (Array.isArray(elem.props.children)) return elem.props.children.join(' ');
              // fallback: try recursion
              return findFirst(elem.props.children, el2 => {
                const e2 = el2 as React.ReactElement<any>;
                return typeof e2.props.children === 'string' ? e2.props.children : undefined;
              });
            }
            return undefined;
          }) || ''
        );
      });
      setThumbs(thumbsArr);
      setTitles(titlesArr);
    }
  }, [cards, activeDot, showDots, bigThumbs, children]);

  let isDragging = false;
  let startX: number;
  let startScrollLeft: number;

  const dragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging = true;
    carousel.current.classList.add('dragging');
    startX = e.pageX;
    startScrollLeft = carousel.current.scrollLeft;
  };

  const dragging = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    carousel.current.classList.add('no-event');
    carousel.current.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = () => {
    isDragging = false;
    carousel.current.classList.remove('no-event');
    carousel.current.classList.remove('dragging');

    const firstCardWidth = (carousel.current.querySelector('.card') as HTMLDivElement).offsetWidth;

    const newActiveDot = Math.round(carousel.current.scrollLeft / firstCardWidth);
    setActiveDot(newActiveDot)
  };

  const handleArrowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const firstCardWidth = (carousel.current?.querySelector('.card') as HTMLDivElement).offsetWidth;
    carousel.current.scrollLeft += btn.id.includes('-left') ? -firstCardWidth : firstCardWidth;
    setTimeout(() => {
      const newActiveDot = Math.round(carousel.current.scrollLeft / firstCardWidth);
      setActiveDot(newActiveDot)
    }, 300);
  };
  
  return (
    <div
      className={`ijrc-carousel-wrapper${customClass ? ' ' + customClass : ''}`}
      style={carouselStyle.wrapper}
    >
      <div className={bigThumbs ? 'flex gas' : ''}>
        {bigThumbs && (
          <ul className="thumbs">
            {[...Array(Children.toArray(children).length - (bigThumbs ? 1 : cards) + 1)].map((_, i) => (
              <li key={i}>
                <button
                  aria-label={`${i + 1} of ${Children.toArray(children).length - (bigThumbs ? 1 : cards) + 1}`}
                  className={`thumb${i === activeDot ? ' active' : ''}`}
                  onClick={() => setActiveDot(i)}
                >
                  {bigThumbs && (
                    <>
                      {thumbs.some(thumb => thumb !== '') &&
                        <span className="thumb-img">
                          {thumbs[i] && (
                            <img draggable="false" src={thumbs[i]} alt={thumbs[i] && `Thumbnail ${i + 1}`} />
                          )}
                        </span>
                      }
                      <span>
                        {titles[i]}
                      </span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        {showButtons && !bigThumbs &&
          <button
            className='carousel-arrow left'
            id={`${id}-carousel-left`}
            title={scrollLeftTitle}
            onClick={handleArrowClick}
          >
            <ArrowLeft width={arrowWidth} color={arrowColor} />
          </button>
        }
        <div
          className='carousel'
          ref={carousel}
          id={id}
          style={carouselStyle.carousel}
          onPointerDown={dragStart}
          onPointerMove={dragging}
          onPointerUp={dragStop}
        >
          {children}
        </div>
        {showButtons && !bigThumbs &&
          <button
            className='carousel-arrow right'
            id={`${id}-carousel-right`}
            title={scrollRightTitle}
            onClick={handleArrowClick}
          >
            <ArrowRight width={arrowWidth} color={arrowColor} />
          </button>
        }
      </div>
      {showDots && !bigThumbs && (
        <ul className="dots">
          {[...Array(Children.toArray(children).length - cards + 1)].map((_, i) => (
            <li key={i}>
              <button
                aria-label={`${i + 1} of ${Children.toArray(children).length - cards + 1}`}
                className={`dot${i === activeDot ? ' active' : ''}`}
                onClick={() => setActiveDot(i)}
              />
            </li>
          ))}
        </ul>
      )}
    
    </div>
  );
};