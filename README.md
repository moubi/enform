<div align="center">
<h1>Enform</h1>

**Enjoyable forms with React 🍿**

<sup>small (2kB gzipped), with no external dependencies</sup>

[![moubi](https://img.shields.io/npm/v/enform?style=flat-square)](https://www.npmjs.com/package/enform) [![moubi](https://img.shields.io/github/license/moubi/enform?style=flat-square)](LICENSE)
</div>

`Enform` will help you with the following:
 - form validation
 - form dirty state
 - form submission and changes
 - field values and error messages

All these add to the frustration when working with forms in React. Enform moves the hassle out of the way. It gives you access to the form state (field values/errors) and provides few handy mathods to alter it.

Read the [docs with some live demos]().

## So, handling form state?
Yes, in a beautiful way. **Working with forms in React should be straightforwad and enjoyable process. Enform tries to achieve that gial by providing you with the most common parts while remaining very small (only 2 kB gzziped ✨).**

## Install
```
yarn add enform
```

## Basic usage (a newsletter form)
<img align="right" width="385" src="./assets/basic_example.png">

```jsx
import React from "react";
import Enform from "enform";

const App = () => (
  <div>
    <h1>Simple form</h1>
    <Enform
      initial={{ name: "" }}
      validation={{ name: values => values.name === "" }}
    >
      {props => (
        <div>
          <input
            className={props.errors.name ? "error" : ""}
            type="text"
            value={props.values.name}
            onChange={e => {
              props.onChange("name", e.target.value);
            }}
          />
          <button onClick={props.onSubmit}>Submit</button>
        </div>
      )}
    </Enform>
  </div>
);
```
[![Edit Basic form with enform](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/newsletter-form-with-enform-dv69b?fontsize=14&hidenavigation=1&theme=dark)

View more of the intereactive [examples here]().

## API
### Component props
| Prop          | Type          | Required | Description |
| ------------- | ------------- | -------- | ----------- |
| children      | function      | yes      | Function that your need to wrap your form with. It provides access to the form state and a way to manipulate it. |
| initial       | object        | yes      | Object with initial form field values in a form of `{ fieldName: value }` |
| validation    | object        | no       | Validation object for your fields. It takes the form of `{ fieldName: function }` where the `function` passes down all form values and should return truthy or falsy value. Truthy is either `true` or an error message. Falsy could be either `false` or an empty string. Example: `{ username: values => values.username === "" ? "This field is required" : false }` |

### State Api
Enform exposes its handy Api by passing an `object` down to the function wrapper.
```jsx
<Enform initial={{ name: "" }}>
  {props => (
    <form />
      ...
    </form>
  )}
</Enform>
```
**The props object contains 2 data items:**
|prop|Description|
|-|-|
| values&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |  Object with the current field values - `{ fieldName: value }`. |
| errors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Object with the current field errors - `{ fieldName: errorMessage }`. errorMessage is a string or boolean or  whatever you return from your validatiors. |

**and these 7 methods:**

|method|Description|
|-|-|
| onChange     |  Updates single field's value - `onChange(fieldName, value)`. The `value` is usually what you will get from `e.target.value`. **Side effects:** clear previous field error |
| onSubmit     | Calls when submitting - `onSubmit(successCallback)`. Usually on button click or directly attached to the `<form />` itself. Your `successCallback` will only be executed if all validations pass. This callback accepts field `values` as an argument. **Side effects:** triggers validation, shows errors or call successCallback. |
| isDirty      |  Reports if the form is dirty. It will take into account the `initial` field values you pass to Enform. |
| validateField&nbsp;&nbsp;&nbsp;&nbsp; | Triggers validation for a single form field - `validateField(fieldName)`. It is often useful if you want to trigger validation on every single change. **Side effects:** triggers validation (display error message)  |
| clearError    | Clears single form field's error - `clearError(fieldName)`. |
| clearErrors   | Clears all errors in the form. |
| clearFields   | Will try to emtpy your form elements. It does so by figuring out the type of the `initial` values. Common use case is clicking a reset button. |

`props.values` gets updated with `onChange` and `clearFields`

`props.errors` gets updated with `onChange`, `onSubmit`, `validateField`, `clearError` and `clearErrors`

## Contributing
You are welcome to open pull requests, issues with bug reports (you can use [codesandbox](https://codesandbox.io/)) and suggestions or simply tweet about Enform.

## Inspiration
Enform is inspired by my experience with form refactoring, [@jaredpalmer](https://jaredpalmer.com/)'s great work on [Formik](https://github.com/jaredpalmer/formik) and the way [@kamranahmedse](https://github.com/kamranahmedse)'s presented [driver.js](https://github.com/kamranahmedse/driver.js).

## Authors
Miroslav Nikolov ([@moubi](https://github.com/moubi))

## License
[MIT](LICENSE)
