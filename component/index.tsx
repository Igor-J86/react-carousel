import ReactDOM from 'react-dom/client';
import { Carousel } from "../src/carousel";
import "../static/ijrc-carousel.css";

const root = ReactDOM.createRoot(document.getElementById('carousel-root') as HTMLElement);

root.render(
  <Carousel>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </Carousel>
);
