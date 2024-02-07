# react-carousel
A responsive React carousel component, written in React with TypeScript.

## Usage
```jsx
import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "@igor-j86/react-carousel";

const SomeComponent = () => {
  return (
    <Carousel>
      <Link to="/1">
        Card 1
      </Link>
      <Link to="/2">
        Card 2
      </Link>
      <Link to="/3">
        Card 3
      </Link>
      <Link to="/4">
        Card 4
      </Link>
      <Link to="/5">
        Card 5
      </Link>
    </Carousel>
  )
}

export default SomeComponent
```

## Optional props
| Prop                    | Default        |
| ----------------------- | -------------- |
| id:string               | 'carousel'     |
| cards:number            | 3              |
| width:string            | '1000px'       |
| autoplay:boolean        | false          |
| interval:number         | 2500           |
| singleScroll:boolean    | false          |
| customClass:string      | ''             |
| scrollRightTitle:string | 'Scroll right' |
| scrollLeftTitle:string  | 'Scroll left'  |
| showButtons:boolean     | true           |

## Developed with
- React
- TypeScript
- Vite
- PostCSS

## License
Distributed under the ISC License.