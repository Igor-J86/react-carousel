import React from 'react';
import '../style/ijrc-carousel.css';
export type carousel = {
    children: any;
    id?: string;
    autoplay?: boolean;
    cards?: number;
    width?: string;
    interval?: number;
    singleScroll?: boolean;
    customClass?: string;
    scrollRightTitle?: string;
    scrollLeftTitle?: string;
    showButtons?: boolean;
};
export type style = {
    wrapper: object;
    carousel: object;
};
export declare const Carousel: React.FC<carousel>;
