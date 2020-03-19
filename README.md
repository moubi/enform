# reform-react
Enjoyable forms with React - validation, changes, submission.

Example bellow: https://codesandbox.io/s/sharp-aryabhata-limwq

```jsx
<div className="App">
  <h1>ReForm</h1>
  <p>Enjoyable forms with React!</p>

  <ReForm
    initial={{
      username: "",
      email: "",
      password: "",
      repeatPassword: ""
    }}
    validation={{
      username: ({ username }) =>
        !isValidUsername(username) ? "invalidAddress" : "",
      email: ({ email }) => (!isValidEmail(email) ? "invalidEmail" : ""),
      password: ({ password, repeatPassword }) =>
        !isValidPassword(password) && !isValidPassword(repeatPassword)
          ? "minSixChar"
          : password !== repeatPassword
          ? "noMatchPassword"
          : ""
    }}
    onSubmit={this.handleSubmit}
  >
    {({ values, errors, onChange }) => (
      <>
        <div>
          <label>Username:</label>
          <input
            className={classNames({
              error: errors.username
            })}
            type="text"
            value={values.username}
            onChange={e => {
              onChange("username", e.target.value);
            }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            className={classNames({
              error: errors.email
            })}
            type="text"
            value={values.email}
            onChange={e => {
              onChange("email", e.target.value);
            }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className={classNames({
              error: errors.password
            })}
            type="password"
            value={values.password}
            onChange={e => {
              onChange("password", e.target.value);
            }}
          />
        </div>
        <div>
          <label>Repeat password:</label>
          <input
            className={classNames({
              error: errors.password
            })}
            type="password"
            value={values.repeatPassword}
            onChange={e => {
              onChange("repeatPassword", e.target.value);
            }}
          />
        </div>
        <button>Submit</button>
      </>
    )}
  </ReForm>
</div>
```
