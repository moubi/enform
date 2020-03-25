<div align="center">
<h1>Enform</h1>

**Enjoyable forms with React 🍿**

[![moubi](https://img.shields.io/npm/v/enform?style=flat-square)](https://www.npmjs.com/package/enform) [![moubi](https://img.shields.io/github/license/moubi/enform?style=flat-square)](LICENSE)
</div>

The README is under construction...

## Why
 - Why do we need this?

Less headache when working with form in React. You can actually enjoy it.

 - Aren't there other implementations? Why another one?
There are other solutions as well. [Formik](https://github.com/jaredpalmer/formik) is a famous one - robust and reliable. **`Enform`, though is lightweight and gives you just the basics you need.** See below ⤵️

## Features
`Enform` tries to hide/help with the following:
 - validation;
 - dirty state;
 - submission and change events;
 - internal state of field values and errors;

## Install
```
yarn add --save enform
```

## Basic usage
```jsx
import React from "react";
import Enform from "enform";

const App = () => (
  <div>
    <h1>Simple form</h1>
    <Enform
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
            value={values.name}
            onChange={e => {
              onChange("name", e.target.value);
            }}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      )}
    </Enform>
  </div>
);
```
[![Edit Basic form with enform](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/unruffled-river-t1zyk?fontsize=14&hidenavigation=1&theme=dark)

## Authors
Miroslav Nikolov ([@moubi](https://github.com/moubi))

## License
[MIT](LICENSE)
