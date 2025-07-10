import React, {useEffect, useRef} from 'react';
import { ArrowLeft, ArrowRight } from './icons';

export type carousel = {
  children: any
  id?: string
  autoplay?: boolean
  autoplayMobile?: boolean
  cards?: number
  width?: string
  interval?: number
  singleScroll?: boolean
  customClass?: string
  scrollRightTitle?: string
  scrollLeftTitle?: string
  showButtons?: boolean
  arrowColor?: string
  arrowWidth?: number
}

export type style = {
  wrapper:object
  carousel:object
}

export const Carousel:React.FC<carousel> = ({
  children,
  id = 'carousel',
  autoplay = false,
  autoplayMobile = false,
  cards = typeof window !== "undefined" && window.innerWidth > 900 ? 3 : 2,
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

  const carousel = useRef<HTMLDivElement>(null)

  const carouselStyle:style = {
    wrapper: {
      maxWidth: width
    },
    carousel: {
      gridAutoColumns: `calc((100% / ${cards}) - 12px)`
    }
  }

  useEffect(() => {
    if(typeof window !== "undefined" && carousel.current) {
      const carouselWrapper = carousel.current.parentElement
      const arrowBtns = carouselWrapper.querySelectorAll('.carousel-arrow')
      const setCards = window.innerWidth > 600 ? cards : 2
      
      const carouselChildren = Array.from(carousel.current?.children || [])
      carouselChildren.forEach((card) => {
        card.setAttribute('draggable', 'false')
        card.classList.add('card')
        singleScroll && card.classList.add('single-scroll')
      })

      let isDragging:boolean = false
      let startX:number
      let startScrollLeft:number
      let timeoutId:number

      carouselChildren.slice(-setCards).reverse().forEach(card => {
        carousel.current.insertAdjacentHTML('afterbegin', card.outerHTML)
      })
      
      carouselChildren.slice(0,setCards).forEach(card => {
        carousel.current.insertAdjacentHTML('beforeend', card.outerHTML)
      })
      
      const firstCard:HTMLDivElement = carousel.current.querySelector('.card')
      const firstCardWidth:number = firstCard.offsetWidth

      if(window.innerWidth < 600) {
        carousel.current.scrollLeft = carousel.current.offsetWidth + firstCardWidth
      } else {
        carousel.current.scrollLeft = carousel.current.offsetWidth
      }
      
      arrowBtns.forEach((btn:HTMLButtonElement) => (
        btn.addEventListener('click', () => {
          carousel.current.scrollLeft += btn.id === `${id}-carousel-left` ? !singleScroll && window.innerWidth > 600 ? setCards * -firstCardWidth : -firstCardWidth : !singleScroll && window.innerWidth > 600 ? setCards * firstCardWidth : firstCardWidth
        })
      ))

      const dragStart = (e:MouseEvent) => {
        isDragging = true
        carousel.current.classList.add('dragging')
        startX = e.pageX
        startScrollLeft = carousel.current.scrollLeft
      }

      const dragging = (e:MouseEvent) => {
        if (!isDragging) return
        carousel.current.classList.add('no-event')
        carousel.current.scrollLeft = startScrollLeft - (e.pageX - startX)
      }

      const dragStop = () => {
        isDragging = false
        carousel.current.classList.remove('no-event')
        carousel.current.classList.remove('dragging')
      }

      const autoPlay = () => {
        if(window.innerWidth < 600 && !autoplayMobile) return
        timeoutId = window.setTimeout(() => carousel.current.scrollLeft += !singleScroll ? setCards * firstCardWidth : firstCardWidth, interval)
      }

      const infiniteScroll = () => {
        if(carousel.current.scrollLeft === 0) {
          carousel.current.classList.add('no-transition')
          carousel.current.scrollLeft = window.innerWidth > 600 ? carousel.current.scrollWidth - (2 * carousel.current.offsetWidth) : carousel.current.scrollWidth - (2 * carousel.current.offsetWidth) * setCards
          carousel.current.classList.remove('no-transition')
        } else if(Math.round(carousel.current.scrollLeft) === carousel.current.scrollWidth - carousel.current.offsetWidth) {
          carousel.current.classList.add('no-transition')
          carousel.current.scrollLeft = window.innerWidth > 600 ? carousel.current.offsetWidth : carousel.current.offsetWidth + (2 * carousel.current.offsetWidth)
          carousel.current.classList.remove('no-transition')
        }

        if(autoplay) {
          clearTimeout(timeoutId)
          if(!carouselWrapper.matches(':hover')) {
            autoPlay()
          }
        }
      }

      carousel.current.addEventListener('mousedown', dragStart)
      carousel.current.addEventListener('mousemove', dragging)
      document.addEventListener('mouseup', dragStop)
      carousel.current.addEventListener('scroll', infiniteScroll)
      if(autoplay) {
        carouselWrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId))
        carouselWrapper.addEventListener('mouseleave', autoPlay)
      }
    }
  }, [carousel])

  return (
    <div
      className={`ijrc-carousel-wrapper${customClass && customClass.length > 0 ? ' ' + customClass : ''}`}
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
        id={id && id.length > 0 ? id : 'carousel'}
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
  )
}