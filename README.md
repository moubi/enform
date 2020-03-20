<div align="center">
<h1>ReFrom</h1>

**Enjoyable forms with React 🍿**

[![moubi](https://img.shields.io/npm/v/reform-react?style=flat-square)](https://www.npmjs.com/package/reform-react) [![moubi](https://img.shields.io/github/license/moubi/reform-react?style=flat-square)](LICENSE)
</div>

## Why
Why do we need this? Aren't there many other implementations?

## Features
`ReForm` tries to hide/help with the following:
 - validation;
 - dirty state;
 - submission and change events;
 - internal state of field values and errors;

## Install
```
yarn add --save reform-react
```

## Basic usage
```jsx
import React from "react";
import ReForm from "./ReForm";

const App = () => (
  <div>
    <h1>Simple form</h1>
    <ReForm
      initial={{ name: "" }}
      validation={{
        name: values => values.name === ""
      }}
    >
      {({ values, errors, onChange, onSubmit }) => (
        <div>
          <input
            className={errors.name ? "error" : ""}
            type="text"
            placeholder="Name"
            value={values.name}
            onChange={e => {
              onChange("name", e.target.value);
            }}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      )}
    </ReForm>
  </div>
);
```
[![Edit Basic form with reform-react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/unruffled-river-t1zyk?fontsize=14&hidenavigation=1&theme=dark)

## Authors
Miroslav Nikolov ([@moubi](https://github.com/moubi))

## License
[MIT](LICENSE)
