import expect from "./utils/unexpected-react";
import React from "react";

import ReForm from "../src/ReForm";

describe("ReForm", () => {
  it("should render default", () => {
    return expect(
      <ReForm initial={{ username: "" }}>
        {({ values, onChange }) => (
          <input
            type="text"
            value={values.username}
            onChange={e => {
              onChange("username", e.target.value);
            }}
          />
        )}
      </ReForm>,
      "when mounted",
      "to exhaustively satisfy",
      <input type="text" value="" />
    );
  });
});
