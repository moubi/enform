import expect from "./utils/unexpected-react";
import React from "react";

import Form from "../src/Form";

let props;

describe("Form", () => {
  it("should render default", () => {
    return expect(
      <Form {...props} />,
      "when mounted",
      "to exhaustively satisfy",
      <div>Items here</div>
    );
  });
});
