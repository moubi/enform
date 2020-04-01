 # Documentation

 - Overview
 - Examples
    - Basic form (field and a button)
    - Newsletter form
    - Registration form
    - Form with dynamic elements
    - Full-featured form
  - API
  - `<Enform />` component props
    - children
    - initial
    - validation
  - `<Enform />` state API
    - values
    - errors
    - onChange
    - onSubmit
    - isDirty
    - validateField
    - clearError
    - clearErrors
    - clearFields
 - How to
    - handle validation
    - ...

## Overview
Enform was born while trying to deal with forms in React repetitive times. Let's face it, things always end up the same. You start building your form components, adding some DOM and then it's time to handle interactions. The result is big state object to manage and a bunch of component methods to handle changes, submission and validation.

It feels like these should be hidden somehow or extracted in another component. Enform is such a component. **It hides the frustraction while still giving you the power of forms in React. And it's only 2 kB**.

Ok, enough theory, let's see some real use case examples.

## Examples
All examples in this section are available in [Codesandbox](https://codesandbox.io/s/basic-form-with-enform-dv69b) with the latest version of Enform. Feel free to experiment, fork or share. Ping me if you think I have messed something up 🤭.

### Basic form (field and a button)
<img align="right" width="385" src="../assets/basic_example.png">

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

Things to note here:
 - required `initial` prop is set with the field's default value
 - `validation` object defines that the field should not be empty
 - `props.onSubmit` is bound to the button click. It will submit whenever validation defined earlier is passed
 - the input field is fully controlled by using `props.values` and `props.onChange`.

### Newsletter form
<img align="right" width="385" src="../assets/newsletter_form.png">

```jsx
<Enform
  initial={{ email: "" }}
  validation={{
    email: values =>
      !/^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/.test(
        values.email
      )
  }}
>
  {props => (
    <div>
      <input
        className={props.errors.email ? "error" : ""}
        type="text"
        placeholder="Your email"
        value={props.values.email}
        onChange={e => {
          props.onChange("email", e.target.value);
        }}
      />
      <button onClick={props.onSubmit}>Submit</button>
    </div>
  )}
</Enform>
```
[![Edit Newsletter form with enform](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/newsletter-form-with-enform-t1zyk?fontsize=14&hidenavigation=1&theme=dark)

In this example we have email `validation` based on a RegEx. Validator function will return `true` if email is invalid or `false` otherwise. All validators must return truthy value (either true or error message) if there is an error.

### Newsletter form
<img align="right" width="385" src="../assets/registration_form.png">

```jsx
<Enform
  initial={{
    user: "",
    email: "",
    password: "",
    repeatPassword: "",
    news: false
  }}
  validation={{
    // Other fields validation here
    password: values => {
      if (values.password.length < 6) {
        return "Password must be at least 6 chars in length!";
      } else if (values.password !== values.repeatPassword) {
        return "Password doesn't match!";
      }
      return false;
    },
    repeatPassword: values =>
      values.repeatPassword.length < 6
        ? "Password must be at least 6 chars in length!"
        : false
  }}
>
  {props => (
    <div className="Form">
      // Other fields DOM here
      <div className={errors.password ? "error" : ""}>
        <input
          type="password"
          placeholder="Password (min 6)"
          value={props.values.password}
          onChange={e => {
            props.onChange("password", e.target.value);
            if (props.errors.repeatPassword) {
              props.clearError("repeatPassword");
            }
          }}
        />
        <p>{props.errors.password}</p>
      </div>
      ...
    </div>
  )}
</Enform>
```
[![Edit Registration form with enform](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/registration-form-with-enform-u6up9?fontsize=14&hidenavigation=1&theme=dark)

I have shortened this example, so that we can focus on two interesting parts - **password validation** and **clearing errors**. You can play with the [full demo in the codesandbox](https://codesandbox.io/s/registration-form-with-enform-u6up9?fontsize=14&hidenavigation=1&theme=dark).

In our registration form we want to display error messages as well. In order that to work each validator function must return the error string in case of an error. Otherwise it may return `false`. The `password` field validation depends on both password and repeatPassword, so it can display two different error messages.

**Second**, on the password `onChange` event we want to also clear the error for `repeatPassword`. Since `props.onChange("password", e.target.value)` will only clear password field's error we have to programatically clear the one for repeatPassword as well. This is done by calling `props.clearError("repeatPassword")`.

### Form with dynamic elements
<img align="right" width="385" src="../assets/dynamic_form.png">

```jsx
<Enform
  // Force Enform to reinitialize itself when adding/removing fields
  key={fieldNames.length}
  initial={{
    email: "",
    // Spread updated fields initial values -
    // stored in the component's state.
    ...this.state.fields
  }}
  validation={{
    email: values =>
      !/^[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,125}[a-zA-Z]{2,63}$/.test(
        values.email
      ),
    // Spread the validation object for the rest of the fields -
    // stored in the component's state.
    ...this.state.fieldsValidation
  }}
>
  {props => (
    <div>
      {/* Map your newly added fields to render in the DOM */}
      {Object.keys(this.state.fields).map(field => (
        <div key={field}>
          <input
            className={props.errors[field] ? "error" : ""}
            type="text"
            placeholder="Email"
            value={props.values[field]}
            onChange={e => {
              props.onChange(field, e.target.value);
            }}
          />
          <button className="remove">Remove</button>
        </div>
      ))}
      <input
        className={props.errors.email ? "error" : ""}
        type="text"
        placeholder="Email"
        value={props.values.email}
        onChange={e => {
          props.onChange("email", e.target.value);
        }}
      />
      <button className="add">Add more</button>
      <button className="save">Save</button>
    </div>
  )}
</Enform>
```
[![Edit Dynamic form fields with enform](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/dynamic-form-fields-with-enform-bnho9?fontsize=14&hidenavigation=1&theme=dark)

Enfrom does not automatically handle dynamic form elements (adding or removing felds), but you can make it aware of these changes with few adjustments. The example above is a short version of the [codesandbox demo](https://codesandbox.io/s/dynamic-form-fields-with-enform-bnho9?fontsize=14&hidenavigation=1&theme=dark).

**Let's start with the basics:** Enform wraps your form DOM and helps you handle its state changes. But you have to make Enform aware when your DOM changes - specifically if it is related to controlled fields. In this code snippet we **force Enform to reinitialize** when more fields are added or removed by setting the `key={fieldNames.length}` prop. Next step is to **update** the `initial` and `validation` props with the fields data. *Note that we have to keep track of this data ourself in our component state fx*. The last thing to do is to render all these newly added fields. Enform will do the rest as usual.

### Full-featured form
<img align="right" width="385" src="../assets/fullfeatured_form.png">

```jsx
<Enform
  initial={{
    email: "",
    password: "",
    age: "",
    frontend: false,
    backend: false,
    fullstack: false,
    devops: false,
    gender: "male",
    bio: "",
    news: false
  }}
  validation={{
    email: ({ email }) =>
      !/^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9-]{1,63}\.){1,125}[A-Za-z]{2,63}$/.test(
        email
      )
        ? "Enter valid email address!"
        : false,
    password: ({ password }) =>
      password.length < 6
        ? "Password must be at least 6 chars in length!"
        : false,
    age: ({ age }) => (age === "" ? "Select age range" : false),
    bio: ({ bio }) => (bio.length > 140 ? "Try to be shorter!" : false)
  }}
>
  {props => (
    <div className="form">
      <div>
        <input
          type="text"
          placeholder="Email"
          value={props.values.email}
          onChange={e => {
            props.onChange("email", e.target.value);
            // This will validate on every change.
            // The error will disappear once email is valid.
            if (props.errors.email) {
              props.validateField("email");
            }
          }}
        />
        <p>{props.errors.email}</p>
      </div>
      <div>
        <input
          type="password"
          placeholder="Password (min 6)"
          value={props.values.password}
          onChange={e => {
            props.onChange("password", e.target.value);
          }}
        />
        <p>{props.errors.password}</p>
      </div>
      <div>
        <select
          value={props.values.age}
          onChange={e => {
            props.onChange("age", e.target.value);
          }}
        >
          <option value="">What is your age</option>
          <option value="10-18">10 - 18</option>
          <option value="19-25">19 - 25</option>
          <option value="26-40">26 - 40</option>
          <option value="41-67">41 - 67</option>
        </select>
        <p>{props.errors.age}</p>
      </div>
      <label>You are:</label>
      <div>
        <input
          type="checkbox"
          id="frontend"
          checked={props.values.frontend}
          onChange={e => {
            props.onChange("frontend", e.target.checked);
          }}
        />
        <label htmlFor="frontend">front-end</label>
        <input
          type="checkbox"
          id="backend"
          checked={props.values.backend}
          onChange={e => {
            props.onChange("backend", e.target.checked);
          }}
        />
        <label htmlFor="backend">back-end</label>
        <input
          type="checkbox"
          id="fullstack"
          checked={props.values.fullstack}
          onChange={e => {
            props.onChange("fullstack", e.target.checked);
          }}
        />
        <label htmlFor="fullstack">full-stack</label>
        <input
          type="checkbox"
          id="devops"
          checked={props.values.devops}
          onChange={e => {
            props.onChange("devops", e.target.checked);
          }}
        />
        <label htmlFor="devops">dev-ops</label>
      </div>
      <label>Gender:</label>
      <div>
        <input
          type="radio"
          id="male"
          name="gender"
          value="male"
          checked={props.values.gender === "male"}
          onChange={() => {
            props.onChange("gender", "male");
          }}
        />
        <label htmlFor="male">male</label>
        <input
          type="radio"
          id="female"
          name="gender"
          value="female"
          checked={props.values.gender === "female"}
          onChange={() => {
            props.onChange("gender", "female");
          }}
        />
        <label htmlFor="female">female</label>
      </div>
      <div>
        <textarea
          type="text"
          placeholder="Short bio (max 140)"
          value={props.values.bio}
          onFocus={() => {
            // Clear the error on field focus
            props.clearError("bio");
          }}
          onChange={e => {
            props.onChange("bio", e.target.value);
          }}
        />
        <p>{props.errors.bio}</p>
      </div>
      <div>
        <input
          id="news"
          type="checkbox"
          checked={props.values.news}
          onChange={e => {
            props.onChange("news", e.target.checked);
          }}
        />
        <label htmlFor="news">
          Send me occasional product updates and offers.
        </label>
      </div>
      <button
        disabled={!isDirty()}
        type="reset"
        onClick={() => {
          // Enform doesn't provide reset() hook,
          // but here is how to achieve the same
          props.clearErrors();
          props.clearFields();
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          props.onSubmit(values => {
            // You can call your own handler function here
            alert(JSON.stringify(values, null, " "));
          });
        }}
      >
        Send
      </button>
    </div>
  )}
</Enform>
```
[![Edit Full-featured form with enform](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/full-featured-form-with-enform-qw3tu?fontsize=14&hidenavigation=1&theme=dark)

This example demonstrates how Enform can handle full-featured form. It uses all of its Api props and methods.

Few interesting areas:
 - **Passing custom callback to `onSubmit`.** In our case the handler is attached to the submit button and simply alerts the field values in pretty format.
 - **Resetting the form.** There is no `props.reset()` method, but we can achieve the same effect by combining `props.clearErrors()` and `props.clearFields()`.
 - **Clear error on focus.** This is done by calling `props.clearError()`. It is bound to the `onFocus` handler of the bio field in the demo.
 - **Validate on every change.** With the email field we have `props.validateField()` called from the `onChange`. It will trigger validation for this field on every change and will be cleared once the valid email is typed.

## API

### `<Enform />` component props

### `<Enform />` state API

## How to
