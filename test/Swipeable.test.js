import expect, { Mounter, getInstance } from "./utils/unexpected-react";
import React from "react";
import sinon from "sinon";

import Swipeable from "../src/Swipeable";

let props;

describe("Swipeable", () => {
  beforeEach(() => {
    props = {
      children: innerRef => (
        <div className="ElementToSwipe" ref={innerRef}>
          Swipe me!
        </div>
      ),
      onSwipeLeft: sinon.stub().named("onSwipeLeft"),
      onSwipeRight: sinon.stub().named("onSwipeRight"),
      onSwipeUp: sinon.stub().named("onSwipeUp"),
      onSwipeDown: sinon.stub().named("onSwipeDown")
    };
  });

  it("should render default", () => {
    return expect(
      <Swipeable {...props} />,
      "when mounted",
      "to exhaustively satisfy",
      <div className="ElementToSwipe">Swipe me!</div>
    );
  });

  it("should attach event listeners on the DOM element", () => {
    const addEventListener = sinon.stub().named("addEventListener");
    props.children = innerRef => (
      <div
        className="ElementToSwipe"
        ref={el => {
          el.addEventListener = addEventListener;
          innerRef(el);
        }}
      >
        Swipe me!
      </div>
    );

    getInstance(
      <Mounter>
        <Swipeable {...props} />
      </Mounter>
    );

    return expect(addEventListener, "to have calls exhaustively satisfying", [
      ["touchstart", expect.it("to be a function")],
      ["touchmove", expect.it("to be a function")],
      ["touchend", expect.it("to be a function")]
    ]);
  });

  it("should set ref to the DOM element", () => {
    const { instance } = getInstance(<Swipeable {...props} />);

    return expect(instance.el, "not to be", null);
  });

  it("should clientX and clientY on touchstart", () => {
    const { instance } = getInstance(<Swipeable {...props} />);

    instance.handleTouchStart({
      touches: [
        {
          clientX: 50,
          clientY: 10
        }
      ]
    });

    return expect(instance.clientX, "to be", 50).then(() =>
      expect(instance.clientY, "to be", 10)
    );
  });

  it("should not trigger move if clientX and clientY are not set", () => {
    const { instance } = getInstance(<Swipeable {...props} />);

    instance.handleTouchStart({
      touches: [
        {
          clientX: 0,
          clientY: 0
        }
      ]
    });
    instance.handleTouchMove({
      touches: [
        {
          clientX: 0,
          clientY: 0
        }
      ]
    });

    return expect(instance.clientXDiff, "to be", 0).then(() =>
      expect(instance.clientYDiff, "to be", 0)
    );
  });

  it("should set clientXDiff and clientYDiff on touchmove", () => {
    const { instance } = getInstance(<Swipeable {...props} />);

    instance.handleTouchStart({
      touches: [
        {
          clientX: 50,
          clientY: 10
        }
      ]
    });
    instance.handleTouchMove({
      touches: [
        {
          clientX: 30,
          clientY: 3
        }
      ]
    });

    return expect(instance.clientXDiff, "to be", 20).then(() =>
      expect(instance.clientYDiff, "to be", 7)
    );
  });

  describe("when swipe is NOT successful", () => {
    it("should NOT swipe horizontally if distance is too small", () => {
      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 50,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 40,
            clientY: 3
          }
        ]
      });
      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was not called").then(() =>
        expect(props.onSwipeLeft, "was not called").then(() =>
          expect(props.onSwipeRight, "was not called")
        )
      );
    });

    it("should NOT swipe horizontally if distance too big", () => {
      props.maxDistance = 100;
      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 50,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 200,
            clientY: 3
          }
        ]
      });

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was not called").then(() =>
        expect(props.onSwipeLeft, "was not called").then(() =>
          expect(props.onSwipeRight, "was not called")
        )
      );
    });

    it("should NOT swipe horizontally if distance is within range, but too much time passed", () => {
      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");
      const clock = sinon.useFakeTimers();

      instance.handleTouchStart({
        touches: [
          {
            clientX: 50,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 100,
            clientY: 3
          }
        ]
      });

      clock.tick(1000);

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was not called").then(() =>
        expect(props.onSwipeLeft, "was not called").then(() =>
          expect(props.onSwipeRight, "was not called")
        )
      );
    });

    it("should NOT swipe vertically if distance is too small", () => {
      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 10,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 20,
            clientY: 3
          }
        ]
      });
      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was not called").then(() =>
        expect(props.onSwipeUp, "was not called").then(() =>
          expect(props.onSwipeDown, "was not called")
        )
      );
    });

    it("should NOT swipe vertically if distance is too big", () => {
      props.maxDistance = 100;
      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 10,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 20,
            clientY: 200
          }
        ]
      });

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was not called").then(() =>
        expect(props.onSwipeUp, "was not called").then(() =>
          expect(props.onSwipeDown, "was not called")
        )
      );
    });

    it("should NOT swipe vertically if distance is within range, but too much time passed", () => {
      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");
      const clock = sinon.useFakeTimers();

      instance.handleTouchStart({
        touches: [
          {
            clientX: 10,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 20,
            clientY: 100
          }
        ]
      });

      clock.tick(1000);

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was not called").then(() =>
        expect(props.onSwipeUp, "was not called").then(() =>
          expect(props.onSwipeDown, "was not called")
        )
      );
    });
  });

  describe("when swipe is successful", () => {
    it("should swipe left", () => {
      props.maxDistance = 100;
      props.timeout = 300;
      const clock = sinon.useFakeTimers();

      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 100,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 20,
            clientY: 3
          }
        ]
      });

      clock.tick(200);

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was called").then(() =>
        expect(props.onSwipeLeft, "was called").then(() =>
          expect(props.onSwipeRight, "was not called")
        )
      );
    });

    it("should swipe right", () => {
      props.maxDistance = 100;
      props.timeout = 300;
      const clock = sinon.useFakeTimers();

      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 20,
            clientY: 10
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 100,
            clientY: 3
          }
        ]
      });

      clock.tick(200);

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was called").then(() =>
        expect(props.onSwipeRight, "was called").then(() =>
          expect(props.onSwipeLeft, "was not called")
        )
      );
    });

    it("should swipe up", () => {
      props.maxDistance = 100;
      props.timeout = 300;
      const clock = sinon.useFakeTimers();

      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 10,
            clientY: 100
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 20,
            clientY: 20
          }
        ]
      });

      clock.tick(200);

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was called").then(() =>
        expect(props.onSwipeUp, "was called").then(() =>
          expect(props.onSwipeDown, "was not called")
        )
      );
    });

    it("should swipe down", () => {
      props.maxDistance = 100;
      props.timeout = 300;
      const clock = sinon.useFakeTimers();

      const { instance } = getInstance(<Swipeable {...props} />);
      const stopPropagation = sinon.stub().named("stopPropagation");

      instance.handleTouchStart({
        touches: [
          {
            clientX: 10,
            clientY: 20
          }
        ]
      });
      instance.handleTouchMove({
        touches: [
          {
            clientX: 20,
            clientY: 100
          }
        ]
      });

      clock.tick(200);

      instance.handleTouchEnd({ stopPropagation });

      return expect(stopPropagation, "was called").then(() =>
        expect(props.onSwipeDown, "was called").then(() =>
          expect(props.onSwipeUp, "was not called")
        )
      );
    });
  });
});
