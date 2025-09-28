import React, { useEffect, useRef, useState, Children } from 'react';
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
    const carouselWrapper = carouselEl.parentElement;
    if (!carouselWrapper) return;

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
      carouselEl.scrollLeft = firstCardWidth * activeDot
    }

    let isDragging = false;
    let startX: number;
    let startScrollLeft: number;
    let timeoutId: number;

    const dragStart = (e: MouseEvent) => {
      isDragging = true;
      carouselEl.classList.add('dragging');
      startX = e.pageX;
      startScrollLeft = carouselEl.scrollLeft;
    };

    const dragging = (e: MouseEvent) => {
      if (!isDragging) return;
      carouselEl.classList.add('no-event');
      carouselEl.scrollLeft = startScrollLeft - (e.pageX - startX);
    };

    const dragStop = () => {
      isDragging = false;
      carouselEl.classList.remove('no-event');
      carouselEl.classList.remove('dragging');

      const newActiveDot = Math.round(carouselEl.scrollLeft / (carouselEl.offsetWidth / cards))
      setActiveDot(newActiveDot)
    };

    const arrowBtns = carouselWrapper.querySelectorAll('.carousel-arrow');
    const handleArrowClick = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      carouselEl.scrollLeft += btn.id.includes('-left') ? -firstCardWidth : firstCardWidth;

      showDots && setActiveDot((prevDot) => (
        btn.id.includes('-left') && prevDot > 0
          ? prevDot - 1
          : btn.id.includes('-right') && Children.toArray(children).length - cards > prevDot
            ? prevDot + 1
            : prevDot
      ));
    };
    
    arrowBtns.forEach(btn => btn.addEventListener('click', handleArrowClick));
    
    carouselEl.addEventListener('pointerdown', dragStart);
    carouselEl.addEventListener('pointermove', dragging);
    document.addEventListener('pointerup', dragStop);

    return () => {
      clearTimeout(timeoutId);
      arrowBtns.forEach(btn => btn.removeEventListener('click', handleArrowClick));
      carouselEl.removeEventListener('pointerdown', dragStart);
      carouselEl.removeEventListener('pointermove', dragging);
      document.removeEventListener('pointerup', dragStop);
    };
  }, [children, cards, interval, id, showDots, activeDot]);

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
          >
            <ArrowLeft width={arrowWidth} color={arrowColor} />
          </button>
        }
        <div
          className='carousel'
          ref={carousel}
          id={id}
          style={carouselStyle.carousel}
        >
          {children}
        </div>
        {showButtons &&
          <button
            className='carousel-arrow right'
            id={`${id}-carousel-right`}
            title={scrollRightTitle}
          >
            <ArrowRight width={arrowWidth} color={arrowColor} />
          </button>
        }
      </div>
      {showDots && (
        <ul className="dots">
          {[...Array(Children.toArray(children).length - cards + 1)].map((_, i) => (
            <li>
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