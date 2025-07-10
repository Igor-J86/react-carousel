import React, { useEffect, useRef, useState, Children } from 'react';
import { ArrowLeft, ArrowRight } from './icons';

export type carousel = {
  children: React.ReactNode;
  id?: string;
  autoplay?: boolean;
  autoplayMobile?: boolean;
  cards?: number;
  width?: string;
  interval?: number;
  singleScroll?: boolean;
  customClass?: string;
  scrollRightTitle?: string;
  scrollLeftTitle?: string;
  showButtons?: boolean;
  arrowColor?: string;
  arrowWidth?: number;
};

export type style = {
  wrapper: object;
  carousel: object;
};

export const Carousel:React.FC<carousel> = ({
  children,
  id = 'carousel',
  autoplay = false,
  autoplayMobile = false,
  cards:propCards = typeof window !== "undefined" && window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1,
  width = '1000px',
  interval = 2500,
  singleScroll = false,
  customClass,
  scrollRightTitle = 'Scroll right',
  scrollLeftTitle = 'Scroll left',
  showButtons = true,
  arrowColor,
  arrowWidth
}) => {
  const carousel = useRef<HTMLDivElement>(null);
  // State to make the component responsive
  const [cards, setCards] = useState(propCards);

  //This effect handles responsiveness
  useEffect(() => {
    const getCardCount = () => {
      if (typeof window === 'undefined') return propCards;
      // You can customize this logic as needed
      return window.innerWidth > 900 ? propCards : window.innerWidth > 600 ? 2 : 1;
    };

    const handleResize = () => {
      setCards(getCardCount());
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    // Cleanup the resize listener
    return () => window.removeEventListener('resize', handleResize);
  }, [propCards]);

  const carouselStyle: style = {
    wrapper: {
      maxWidth: width,
    },
    carousel: {
      gridAutoColumns: `calc((100% / ${cards}) - 12px)`,
    },
  };

  useEffect(() => {
    // Ensure we don't run this logic if the ref is not set
    if (!carousel.current) return;
    
    const carouselEl = carousel.current;
    const carouselWrapper = carouselEl.parentElement;
    if (!carouselWrapper) return;

    //  Use the children already rendered by React as the source of truth.
    const originalChildrenHTML = Array.from(carouselEl.children).map(child => child.outerHTML);
    if (originalChildrenHTML.length === 0) return;

    // Build the full carousel string with clones.
    const clonesBefore = originalChildrenHTML.slice(-cards).join('');
    const clonesAfter = originalChildrenHTML.slice(0, cards).join('');
    
    // Set the final HTML. This ensures we have a clean slate with all required cards.
    carouselEl.innerHTML = clonesBefore + originalChildrenHTML.join('') + clonesAfter;
    
    // Now, proceed with the rest of your logic on the newly created DOM elements
    const allCards = Array.from(carouselEl.children);
    allCards.forEach((card) => {
      card.setAttribute('draggable', 'false');
      card.classList.add('card');
      if (singleScroll) card.classList.add('single-scroll');
    });
    
    const firstCard = carouselEl.querySelector('.card') as HTMLDivElement;
    if (!firstCard) return;

    const firstCardWidth = firstCard.offsetWidth;
    carouselEl.scrollLeft = firstCardWidth * cards;

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
    };

    const autoPlay = () => {
      if (window.innerWidth < 600 && !autoplayMobile) return;
      const scrollBy = singleScroll ? firstCardWidth : cards * firstCardWidth;
      timeoutId = window.setTimeout(() => carouselEl.scrollLeft += scrollBy, interval);
    };

    const totalCards = originalChildrenHTML.length;

    const infiniteScroll = () => {
      if(carouselEl.scrollLeft === 0) {
        carouselEl.classList.add('no-transition')
        carouselEl.scrollLeft = firstCardWidth * totalCards
        carouselEl.classList.remove('no-transition')
      } else if(carouselEl.scrollLeft >= firstCardWidth * (totalCards + cards - 0.5)) {
        carouselEl.classList.add('no-transition')
        carouselEl.scrollLeft = firstCardWidth * cards
        carouselEl.classList.remove('no-transition')
      }

      if(autoplay) {
        clearTimeout(timeoutId)
        if(!carouselWrapper.matches(':hover')) {
          autoPlay()
        }
      }
    }


    const arrowBtns = carouselWrapper.querySelectorAll('.carousel-arrow');
    const handleArrowClick = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const scrollBy = singleScroll ? firstCardWidth : cards * firstCardWidth;
      carouselEl.scrollLeft += btn.id.includes('-left') ? -scrollBy : scrollBy;
    };
    
    arrowBtns.forEach(btn => btn.addEventListener('click', handleArrowClick));
    
    carouselEl.addEventListener('mousedown', dragStart);
    carouselEl.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);
    carouselEl.addEventListener('scroll', infiniteScroll);

    const handleMouseEnter = () => clearTimeout(timeoutId);
    const handleMouseLeave = () => autoPlay();

    if (autoplay) {
      carouselWrapper.addEventListener('mouseenter', handleMouseEnter);
      carouselWrapper.addEventListener('mouseleave', handleMouseLeave);
      autoPlay();
    }

    // The cleanup function to prevent memory leaks
    return () => {
      clearTimeout(timeoutId);
      arrowBtns.forEach(btn => btn.removeEventListener('click', handleArrowClick));
      carouselEl.removeEventListener('mousedown', dragStart);
      carouselEl.removeEventListener('mousemove', dragging);
      document.removeEventListener('mouseup', dragStop);
      carouselEl.removeEventListener('scroll', infiniteScroll);
      if (autoplay && carouselWrapper) {
          carouselWrapper.removeEventListener('mouseenter', handleMouseEnter);
          carouselWrapper.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
    
  }, [children, cards, autoplay, autoplayMobile, singleScroll, interval, id]);

  return (
    <div
      className={`ijrc-carousel-wrapper${customClass ? ' ' + customClass : ''}`}
      style={carouselStyle.wrapper}
    >
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
        key={Children.count(children)}
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
  );
};