import React, { useEffect, useRef, useState, Children, act } from 'react';
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
  arrowWidth
}) => {
  const carousel = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState(propCards);
  const [activeDot, setActiveDot] = useState(0)
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const getCardCount = () => {
      if (window === undefined) return propCards;
      // You can customize this logic as needed
      return window.innerWidth > 900 ? propCards : window.innerWidth > 600 ? 2 : 1;
    };

    const handleResize = () => {
      setCards(getCardCount());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [propCards]);

  const carouselStyle:Style = {
    wrapper: {
      maxWidth: width,
    },
    carousel: {
      gridAutoColumns: `calc((100% / ${cards}) - 12px)`,
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
    });
    
    const firstCard = carouselEl.querySelector('.card') as HTMLDivElement;
    if (!firstCard) return;

    const firstCardWidth = firstCard.offsetWidth;

    if(showDots) {
      const idx = Math.round(carouselEl.scrollLeft / firstCardWidth);
      if(idx !== activeDot && scrolling) {
        carouselEl.scrollLeft = firstCardWidth * activeDot
        setScrolling(false);
        setActiveDot(idx);
      }
    }
  }, [cards, activeDot, showDots, scrolling]);

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
    const firstCardWidth = (carousel.current.querySelector('.card') as HTMLDivElement).offsetWidth;
    carousel.current.scrollLeft += btn.id.includes('-left') ? -firstCardWidth : firstCardWidth;
  };

  const handleScroll = () => {
    const firstCardWidth = (carousel.current.querySelector('.card') as HTMLDivElement).offsetWidth;
    const idx = Math.round(carousel.current.scrollLeft / firstCardWidth);
    if(idx !== activeDot && !isDragging && !scrolling) {
      setActiveDot(idx);
    }
  };
  
  return (
    <div
      className={`ijrc-carousel-wrapper${customClass ? ' ' + customClass : ''}`}
      style={carouselStyle.wrapper}
    >
      <div>
        {showButtons &&
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
          onScroll={handleScroll}
        >
          {children}
        </div>
        {showButtons &&
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
      {showDots && (
        <ul className="dots">
          {[...Array(Children.toArray(children).length - cards + 1)].map((_, i) => (
            <li key={i}>
              <button
                aria-label={`${i + 1} of ${Children.toArray(children).length - cards + 1}`}
                className={`dot${i === activeDot ? ' active' : ''}`}
                onPointerUp={() => {setActiveDot(i); setScrolling(i !== activeDot);}}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};