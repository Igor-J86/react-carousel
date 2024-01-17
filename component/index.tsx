import React from "react";
import {createRoot} from 'react-dom/client';
import { Carousel } from "../src/carousel";

const root = createRoot(document.getElementById('carousel-root')!);

root.render(
  <Carousel autoplay>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </Carousel>
);
