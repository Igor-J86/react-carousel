import React from "react";
import {createRoot} from 'react-dom/client';
import { Carousel } from "../lib/esm/";

const root = createRoot(document.getElementById('carousel-root')!);

root.render(
  <Carousel autoplay singleScroll>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
  </Carousel>
);

