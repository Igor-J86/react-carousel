import React, {useEffect} from 'react';
import { ArrowLeft, ArrowRight } from './icons';
import '../style/ijrc-carousel.css';

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
  cards = window.innerWidth > 900 ? 3 : 2,
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

  const carouselStyle:style = {
    wrapper: {
      maxWidth: width
    },
    carousel: {
      gridAutoColumns: `calc((100% / ${cards}) - 12px)`
    }
  }

  useEffect(() => {
    const carousel:any = document.querySelector(`#${id}`)
    if(carousel) {
      const carouselWrapper:HTMLDivElement = carousel.parentElement
      const arrowBtns:Array<HTMLButtonElement> = carousel.parentElement.querySelectorAll('.carousel-arrow')
      const setCards = window.innerWidth > 600 ? cards : 2
      
      const carouselChildren:Array<HTMLElement> = [...carousel.children]
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
        carousel.insertAdjacentHTML('afterbegin', card.outerHTML)
      })
      
      carouselChildren.slice(0,setCards).forEach(card => {
        carousel.insertAdjacentHTML('beforeend', card.outerHTML)
      })
      
      const firstCardWidth:number = carousel.querySelector('.card').offsetWidth

      if(window.innerWidth < 600) {
        carousel.scrollLeft = carousel.offsetWidth + firstCardWidth
      } else {
        carousel.scrollLeft = carousel.offsetWidth
      }
      
      arrowBtns.forEach((btn:HTMLButtonElement) => (
        btn.addEventListener('click', () => {
          carousel.scrollLeft += btn.id === `${id}-carousel-left` ? !singleScroll && window.innerWidth > 600 ? setCards * -firstCardWidth : -firstCardWidth : !singleScroll && window.innerWidth > 600 ? setCards * firstCardWidth : firstCardWidth
        })
      ))

      const dragStart = (e:MouseEvent) => {
        isDragging = true
        carousel.classList.add('dragging')
        startX = e.pageX
        startScrollLeft = carousel.scrollLeft
      }

      const dragging = (e:MouseEvent) => {
        if (!isDragging) return
        carousel.classList.add('no-event')
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
      }

      const dragStop = () => {
        isDragging = false
        carousel.classList.remove('no-event')
        carousel.classList.remove('dragging')
      }

      const autoPlay = () => {
        if(window.innerWidth < 600 && !autoplayMobile) return
        timeoutId = window.setTimeout(() => carousel.scrollLeft += !singleScroll ? setCards * firstCardWidth : firstCardWidth, interval)
      }

      const infiniteScroll = () => {
        if(carousel.scrollLeft === 0) {
          carousel.classList.add('no-transition')
          carousel.scrollLeft = window.innerWidth > 600 ? carousel.scrollWidth - (2 * carousel.offsetWidth) : carousel.scrollWidth - (2 * carousel.offsetWidth) * setCards
          carousel.classList.remove('no-transition')
        } else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
          carousel.classList.add('no-transition')
          carousel.scrollLeft = window.innerWidth > 600 ? carousel.offsetWidth : carousel.offsetWidth + (2 * carousel.offsetWidth)
          carousel.classList.remove('no-transition')
        }

        if(autoplay) {
          clearTimeout(timeoutId)
          if(!carouselWrapper.matches(':hover')) {
            autoPlay()
          }
        }
      }

      carousel.addEventListener('mousedown', dragStart)
      carousel.addEventListener('mousemove', dragging)
      document.addEventListener('mouseup', dragStop)
      carousel.addEventListener('scroll', infiniteScroll)
      if(autoplay) {
        carouselWrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId))
        carouselWrapper.addEventListener('mouseleave', autoPlay)
      }
    }
  }, [])

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