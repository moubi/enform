import unexpected from "unexpected";
import unexpectedDom from "unexpected-dom";
import unexpectedReaction from "unexpected-reaction";
import ReactDom from "react-dom";
import React, { Component } from "react";
import unexpectedSinon from "unexpected-sinon";
import PropTypes from "prop-types";

const expect = unexpected
  .clone()
  .use(unexpectedDom)
  .use(unexpectedReaction)
  .use(unexpectedSinon);

export class Mounter extends Component {
  render() {
    return <div className="Mounter">{this.props.children}</div>;
  }
}

Mounter.propTypes = {
  children: PropTypes.node
};

export function getInstance(reactElement, tagName = "div") {
  const div = document.createElement(tagName);
  const element = ReactDom.render(reactElement, div);

  const result = {
    instance: element,
    subject: div.firstChild
  };

  return result;
}

export { simulate } from "react-dom-testing";

export default expect;
