import React, {useEffect} from 'react';
import { ArrowLeft, ArrowRight } from './icons';
import "../style/carousel.css";

export type carousel = {
  children: any
  id?: string
  autoplay?: boolean
  cards?: number
  width?: string
  interval?: number
  singleScroll?: boolean
  customClass?: string
}

export type style = {
  wrapper:object
  carousel:object
}

export const Carousel:React.FC<carousel> = ({
  children,
  id = 'carousel',
  autoplay = false,
  cards = 3,
  width = '1000px',
  interval = 2500,
  singleScroll = false,
  customClass
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
      const arrowBtns:Array<HTMLButtonElement> = carousel.parentElement.querySelectorAll(".carousel-arrow")
      
      const carouselChildren:Array<HTMLElement> = [...carousel.children]
      carouselChildren.forEach((card) => {
        card.setAttribute('draggable', 'false')
        card.classList.add('card')
      })

      let isDragging:boolean = false
      let startX:number
      let startScrollLeft:number
      let timeoutId:number

      //let cardPerView:number = Math.round(carousel.offsetWidth / firstCardWidth)

      carouselChildren.slice(-cards).reverse().forEach(card => {
        carousel.insertAdjacentHTML("afterbegin", card.outerHTML)
      })

      carouselChildren.slice(0,cards).forEach(card => {
        carousel.insertAdjacentHTML("beforeend", card.outerHTML)
      })

      const firstCardWidth:number = carousel.querySelector(".card").offsetWidth

      arrowBtns.forEach((btn:HTMLButtonElement) => (
        btn.addEventListener("click", () => {
          carousel.scrollLeft += btn.id === `${id}-carousel-left` ? !singleScroll ? cards * -firstCardWidth : -firstCardWidth : !singleScroll ? cards * firstCardWidth : firstCardWidth
        })
      ))

      carousel.scrollLeft = carousel.offsetWidth

      const dragStart = (e:MouseEvent) => {
        isDragging = true
        carousel.classList.add("dragging")
        startX = e.pageX
        startScrollLeft = carousel.scrollLeft
      }

      const dragging = (e:MouseEvent) => {
        if (!isDragging) return
        carousel.classList.add("no-event")
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
      }

      const dragStop = () => {
        isDragging = false
        carousel.classList.remove("no-event")
        carousel.classList.remove("dragging")
      }

      const autoPlay = () => {
        if(window.innerWidth < 600) return
        timeoutId = window.setTimeout(() => carousel.scrollLeft += firstCardWidth, interval)
      }

      const infiniteScroll = () => {
        if(carousel.scrollLeft === 0) {
          carousel.classList.add("no-transition")
          carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth)
          carousel.classList.remove("no-transition")
        } else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
          carousel.classList.add("no-transition")
          carousel.scrollLeft = carousel.offsetWidth
          carousel.classList.remove("no-transition")
        }

        if(autoplay) {
          clearTimeout(timeoutId)
          if(!carouselWrapper.matches(':hover')) {
            autoPlay()
          }
        }
      }

      carousel.addEventListener("mousedown", dragStart)
      carousel.addEventListener("mousemove", dragging)
      document.addEventListener("mouseup", dragStop)
      carousel.addEventListener("scroll", infiniteScroll)
      if(autoplay) {
        carouselWrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId))
        carouselWrapper.addEventListener("mouseleave", autoPlay)
      }
    }
  }, [])

  return (
    <div className={`ijrc-carousel-wrapper${customClass && customClass.length > 0 ? ' ' + customClass : ''}`} style={carouselStyle.wrapper}>
      <button className="carousel-arrow left" id={`${id}-carousel-left`}>
        <ArrowLeft width={10} />
      </button>
      <div className="carousel" id={id && id.length > 0 ? id : 'carousel'} style={carouselStyle.carousel}>
        {children}
      </div>
      <button className="carousel-arrow right" id={`${id}-carousel-right`}>
        <ArrowRight width={10} />
      </button>
    </div>
  )
}