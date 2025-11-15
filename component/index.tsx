import ReactDOM from 'react-dom/client';
import { Carousel } from "../src/carousel";
import "../static/ijrc-carousel.css";

const root = ReactDOM.createRoot(document.getElementById('carousel-root') as HTMLElement);

root.render(
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
    <h2>Standard</h2>
    <Carousel>
      <div>
        <h2>Title 1</h2>
      </div>
      <div>
        <h2>Title 2</h2>
      </div>
      <div>
        <h2>Title 322</h2>
      </div>
      <div>
        <h2>Title 4</h2>
      </div>
      <div>
        <h2>Title 5</h2>
      </div>
    </Carousel>

    <h2>Big Thumbnails</h2>
    <Carousel bigThumbs>
      <div>
        <h2>New functionality available!</h2>
        <div className='flex flex-wrap'>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <img src="https://picsum.photos/300/200?random=1" alt="Thumbnail 1" />
        </div>
      </div>
      <div>
        <h2>Coming soon</h2>
        <div className='flex flex-wrap'>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <img src="https://picsum.photos/300/200?random=2" alt="Thumbnail 2" />
        </div>
      </div>
      <div>
        <h2>This is cool</h2>
        <div className='flex flex-wrap'>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <img src="https://picsum.photos/300/200?random=3" alt="Thumbnail 3" />
          <img src="https://picsum.photos/300/200?random=4" alt="Thumbnail 4" />
        </div>
      </div>
      <div>
        <h2>Make component versatile</h2>
        <div className='flex flex-wrap'>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <img src="https://picsum.photos/300/200?random=5" alt="Thumbnail 5" />
        </div>
      </div>
    </Carousel>
  </div>
);
