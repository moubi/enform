# swipeable-react
Compact react component to handle swiping on touch devices.

[![moubi](https://img.shields.io/circleci/build/gh/moubi/swipeable-react?label=circleci&style=flat-square)](https://circleci.com/gh/moubi/swipeable-react) [![moubi](https://img.shields.io/npm/v/swipeable-react?style=flat-square)](https://www.npmjs.com/package/swipeable-react) [![moubi](https://img.shields.io/github/license/moubi/swipeable-react?style=flat-square)](LICENSE)

## Install
```
yarn add --save swipeable-react
```

## Usage
```jsx
import Swipeable from "swipeable-react";
...

function YourOwnComponent(props) {
  return (
    <Swipeable
      onSwipeLeft={() => { console.log("swiped left"); }}
      onSwipeRight={() => { console.log("swiped right"); }}
    >
      {innerRef => (
        <div ref={innerRef}>
          I will detect swiping!
        </div>
      )}
    </Swipeable>
  );
}
```

### Notes
 - Supports both vertical and horizontal swiping.
 - Uses `touchstart`, `touchmove` and `touchend` events
 - Multiple nested Swipeables are supported.

 Note that in this scenario successful inner swipe will prevent parent swipeables. The preventing is done by calling `stopPropagation()` in the `touchend` handler.

## API
| Prop          | Type          | Default  | Description |
| ------------- | ------------- | -------- | ----------- |
| children      | function      |          | Function that passes the ref down to the DOM element which will get touch events attached to. |
| minDistance   | number        | 20       | min distance in px between touchstart and touchend |
| maxDistance   | number        | Infinity | max distance in px between touchstart and touchend |
| timeout       | number        | 500      | the time in ms between touchstart and touchend     |
| onSwipeLeft   | function      |          | handler for successful swipe left                  |
| onSwipeRight  | function      |          | handler for successful swipe right                 |
| onSwipeUp     | function      |          | handler for successful swipe up                    |
| onSwipeDown   | function      |          | handler for successful swipe down                  |

  \* All props are optional except the **children**.

## Development
The project is built on node `v10.15.1`. Set as default in `.nvmrc` for nvm users.
```
yarn
```

Tests run in jest watch mode:
```
yarn test
```

Deploying by:
```
yarn build
```
That will create a `lib/` folder with `index.js` file containing transpiled code from the `src/Swipeable.js` component

## Credits
Non-react [swiped-events](https://github.com/john-doherty/swiped-events)

## License
[MIT License](LICENSE)
