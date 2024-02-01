"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carousel = void 0;
var react_1 = __importStar(require("react"));
var icons_1 = require("./icons");
require("../style/ijrc-carousel.css");
var Carousel = function (_a) {
    var children = _a.children, _b = _a.id, id = _b === void 0 ? 'carousel' : _b, _c = _a.autoplay, autoplay = _c === void 0 ? false : _c, _d = _a.cards, cards = _d === void 0 ? window.innerWidth > 900 ? 3 : 2 : _d, _e = _a.width, width = _e === void 0 ? '1000px' : _e, _f = _a.interval, interval = _f === void 0 ? 2500 : _f, _g = _a.singleScroll, singleScroll = _g === void 0 ? false : _g, customClass = _a.customClass, _h = _a.scrollRightTitle, scrollRightTitle = _h === void 0 ? 'Scroll right' : _h, _j = _a.scrollLeftTitle, scrollLeftTitle = _j === void 0 ? 'Scroll left' : _j, _k = _a.showButtons, showButtons = _k === void 0 ? true : _k;
    var carouselStyle = {
        wrapper: {
            maxWidth: width
        },
        carousel: {
            gridAutoColumns: "calc((100% / ".concat(cards, ") - 12px)")
        }
    };
    (0, react_1.useEffect)(function () {
        var carousel = document.querySelector("#".concat(id));
        if (carousel) {
            var carouselWrapper_1 = carousel.parentElement;
            var arrowBtns = carousel.parentElement.querySelectorAll('.carousel-arrow');
            var carouselChildren = __spreadArray([], carousel.children, true);
            carouselChildren.forEach(function (card) {
                card.setAttribute('draggable', 'false');
                card.classList.add('card');
                singleScroll && card.classList.add('single-scroll');
            });
            var isDragging_1 = false;
            var startX_1;
            var startScrollLeft_1;
            var timeoutId_1;
            //let cardPerView:number = Math.round(carousel.offsetWidth / firstCardWidth)
            carouselChildren.slice(-cards).reverse().forEach(function (card) {
                carousel.insertAdjacentHTML('afterbegin', card.outerHTML);
            });
            carouselChildren.slice(0, cards).forEach(function (card) {
                carousel.insertAdjacentHTML('beforeend', card.outerHTML);
            });
            var firstCardWidth_1 = carousel.querySelector('.card').offsetWidth;
            if (window.innerWidth < 600) {
                carousel.scrollLeft = carousel.offsetWidth + firstCardWidth_1;
            }
            else {
                carousel.scrollLeft = carousel.offsetWidth;
            }
            arrowBtns.forEach(function (btn) { return (btn.addEventListener('click', function () {
                carousel.scrollLeft += btn.id === "".concat(id, "-carousel-left") ? !singleScroll && window.innerWidth > 600 ? cards * -firstCardWidth_1 : -firstCardWidth_1 : !singleScroll && window.innerWidth > 600 ? cards * firstCardWidth_1 : firstCardWidth_1;
            })); });
            var dragStart = function (e) {
                isDragging_1 = true;
                carousel.classList.add('dragging');
                startX_1 = e.pageX;
                startScrollLeft_1 = carousel.scrollLeft;
            };
            var dragging = function (e) {
                if (!isDragging_1)
                    return;
                carousel.classList.add('no-event');
                carousel.scrollLeft = startScrollLeft_1 - (e.pageX - startX_1);
            };
            var dragStop = function () {
                isDragging_1 = false;
                carousel.classList.remove('no-event');
                carousel.classList.remove('dragging');
            };
            var autoPlay_1 = function () {
                if (window.innerWidth < 600)
                    return;
                timeoutId_1 = window.setTimeout(function () { return carousel.scrollLeft += !singleScroll ? cards * firstCardWidth_1 : firstCardWidth_1; }, interval);
            };
            var infiniteScroll = function () {
                if (carousel.scrollLeft === 0) {
                    carousel.classList.add('no-transition');
                    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
                    carousel.classList.remove('no-transition');
                }
                else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
                    carousel.classList.add('no-transition');
                    carousel.scrollLeft = carousel.offsetWidth;
                    carousel.classList.remove('no-transition');
                }
                if (autoplay) {
                    clearTimeout(timeoutId_1);
                    if (!carouselWrapper_1.matches(':hover')) {
                        autoPlay_1();
                    }
                }
            };
            carousel.addEventListener('mousedown', dragStart);
            carousel.addEventListener('mousemove', dragging);
            document.addEventListener('mouseup', dragStop);
            carousel.addEventListener('scroll', infiniteScroll);
            if (autoplay) {
                carouselWrapper_1.addEventListener('mouseenter', function () { return clearTimeout(timeoutId_1); });
                carouselWrapper_1.addEventListener('mouseleave', autoPlay_1);
            }
        }
    }, []);
    return (react_1.default.createElement("div", { className: "ijrc-carousel-wrapper".concat(customClass && customClass.length > 0 ? ' ' + customClass : ''), style: carouselStyle.wrapper },
        showButtons &&
            react_1.default.createElement("button", { className: 'carousel-arrow left', id: "".concat(id, "-carousel-left"), title: scrollLeftTitle },
                react_1.default.createElement(icons_1.ArrowLeft, { width: 10 })),
        react_1.default.createElement("div", { className: 'carousel', id: id && id.length > 0 ? id : 'carousel', style: carouselStyle.carousel }, children),
        showButtons &&
            react_1.default.createElement("button", { className: 'carousel-arrow right', id: "".concat(id, "-carousel-right"), title: scrollRightTitle },
                react_1.default.createElement(icons_1.ArrowRight, { width: 10 }))));
};
exports.Carousel = Carousel;
