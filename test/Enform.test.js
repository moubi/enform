import expect from "./utils/unexpected-react";
import React from "react";

import Enform from "../src/Enform";

describe("Enform", () => {
  it("should render default", () => {
    return expect(
      <Enform initial={{ username: "" }}>
        {({ values, onChange }) => (
          <input
            type="text"
            value={values.username}
            onChange={e => {
              onChange("username", e.target.value);
            }}
          />
        )}
      </Enform>,
      "when mounted",
      "to exhaustively satisfy",
      <input type="text" value="" />
    );
  });
});
