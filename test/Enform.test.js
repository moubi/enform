import expect, {
  getInstance,
  simulate,
  PropUpdater
} from "./utils/unexpected-react";
import React, { useState } from "react";
import sinon from "sinon";

import Enfrom from "../src/Enform";

describe("Enfrom", () => {
  it("should render default", () => {
    expect(
      <Enfrom initial={{ username: "" }}>
        {({ values }) => (
          <input type="text" value={values.username} onChange={() => {}} />
        )}
      </Enfrom>,
      "when mounted",
      "to exhaustively satisfy",
      <input type="text" value="" onChange={expect.it("to be a function")} />
    );
  });

  it("should render with non empty initial value", () => {
    expect(
      <Enfrom initial={{ username: "jason" }}>
        {({ values }) => (
          <input type="text" value={values.username} onChange={() => {}} />
        )}
      </Enfrom>,
      "to exhaustively satisfy",
      <input
        type="text"
        value="jason"
        onChange={expect.it("to be a function")}
      />
    );
  });

  // TODO: This could be fixed with deep equal comparison, which is not desired
  it("should NOT update default values when initial prop changes, but remains the same ref", () => {
    const props = {
      change: false,
      initial: { username: "" }
    };
    const updatedProps = {
      change: true,
      initial: props.initial
    }

    function ParentComponent({ initial, change }) {
      // A way to simulate change in the initial prop while
      // keep ref to the same object
      if (change) {
        initial.username = "john";
      }

      return (
        <Enfrom initial={initial}>
          {({ values }) => (
            <input type="text" value={values.username} onChange={() => {}} />
          )}
        </Enfrom>
      );
    }

    const { applyPropsUpdate, subject } = getInstance(
      <PropUpdater propsUpdate={updatedProps}>
        <ParentComponent {...props} />
      </PropUpdater>
    );

    applyPropsUpdate();

    // Still displays the firstly set empty username
    expect(subject, "queried for first", "input", "to have attributes", {
      value: ""
    });
  });

  it("should NOT clear field value if re-render with same initial values", () => {
    function ParentComponent() {
      const [loading, setLoading] = useState(false);

      return (
        <Enfrom initial={{ username: "" }}>
          {({ values, onSubmit, onChange }) => (
            <form onSubmit={() => {
              setLoading(true);
              onSubmit(() => {
                setLoading(false);
              });
            }}>
              {loading && <span>Loading...</span>}
              <input type="text" value={values.username} onChange={e => {
                onChange("username", e.target.value)
              }} />
            </form>
          )}
        </Enfrom>
      );
    }

    const { subject } = getInstance(<ParentComponent />);

    simulate(subject, [
      {
        type: "change",
        target: "input",
        value: "john"
      },
      {
        type: "submit"
      }
    ]);

    expect(
      subject,
      "queried for first",
      "input",
      "to have attributes", {
        value: "john"
      }
    );
  });

  it("should update default values when initial prop changes", () => {
    const { applyPropsUpdate, subject } = getInstance(
      <PropUpdater propsUpdate={{ initial: { username: "john" } }}>
        <Enfrom initial={{ username: "" }}>
          {({ values }) => (
            <input type="text" value={values.username} onChange={() => {}} />
          )}
        </Enfrom>
      </PropUpdater>
    );

    applyPropsUpdate();

    expect(subject, "queried for first", "input", "to have attributes", {
      value: "john"
    });
  });

  describe("with a programmatically set error", () => {
    it("should set non user input errors", () => {
      const { subject } = getInstance(
        <Enfrom initial={{ username: "" }}>
          {({ values, errors, setErrors }) => (
            <form onSubmit={() => setErrors({ username: "Error from an API call!" })}>
              <input
                type="text"
                value={values.username}
                onChange={() => {}}
              />
              {errors.username && <p>{errors.username}</p>}
            </form>
          )}
        </Enfrom>
      );

      simulate(subject, { type: "submit" });

      expect(subject, "queried for first", "p", "to have text", "Error from an API call!");
    });

    it("should clear programmatically set error", () => {
      const { subject } = getInstance(
        <Enfrom initial={{ username: "john" }}>
          {({ values, errors, setErrors, onChange }) => (
            <form onSubmit={() => setErrors({ username: "Error from an API call!" })}>
              <input
                type="text"
                value={values.username}
                onChange={e => onChange("username", e.target.value)}
              />
              {errors.username && <p>{errors.username}</p>}
            </form>
          )}
        </Enfrom>
      );

      simulate(subject, [
        { type: "submit" },
        {
          type: "change",
          target: "input",
          value: ""
        }
      ]);

      expect(subject, "to contain no elements matching", "p");
    });

    it("should not set errors for non existent field name", () => {
      const { subject } = getInstance(
        <Enfrom initial={{ username: "" }}>
          {({ values, errors, setErrors }) => (
            <form onSubmit={() => setErrors({ email: "johnthewebdev@gmail.com" })}>
              <input
                type="text"
                value={values.username}
                onChange={() => {}}
              />
              {errors.email && <p>{errors.email}</p>}
            </form>
          )}
        </Enfrom>
      );

      simulate(subject, { type: "submit" });

      expect(subject, "to contain no elements matching", "p");
    });
  });

  describe("with a single field", () => {
    let subject = null;
    let handleSubmit = null;

    beforeEach(() => {
      handleSubmit = sinon.stub().named("handleSubmit");
      subject = getInstance(
        <Enfrom
          initial={{ username: "" }}
          validation={{
            username: ({ username }) =>
              username.length < 3 ? "Min 3 chars" : ""
          }}
        >
          {({ values, errors, onChange, onSubmit, validateField }) => (
            <form
              onSubmit={() => {
                onSubmit(handleSubmit);
              }}
            >
              <input
                className={errors.username ? "error" : ""}
                type="text"
                value={values.username}
                onChange={e => {
                  onChange("username", e.target.value);
                }}
                onFocus={() => {
                  validateField("username");
                }}
              />
              <p>
                {errors.username === false && "No errors"}
              </p>
            </form>
          )}
        </Enfrom>
      ).subject;
    });

    it("should update the value", () => {
      simulate(subject, {
        type: "change",
        target: "input",
        data: {
          target: {
            value: "new value"
          }
        }
      });

      expect(subject, "queried for first", "input", "to have attributes", {
        value: "new value"
      });
    });

    it("should set an error class", () => {
      simulate(subject, { type: "submit" });

      expect(subject, "queried for first", "input", "to have class", "error");
    });

    it("should default passing field validation to 'false'", () => {
      simulate(subject, [
        {
          type: "change",
          target: "input",
          data: {
            target: {
              value: "new value"
            }
          }
        },
        { type: "submit" }
      ]);

      expect(subject, "queried for first", "p", "to have text", "No errors");
    });

    it("should default passing single field validation to 'false'", () => {
      simulate(subject, [
        {
          type: "change",
          target: "input",
          data: {
            target: {
              value: "new value"
            }
          }
        },
        {
          type: "focus",
          target: "input"
        }
      ]);

      expect(subject, "queried for first", "p", "to have text", "No errors");
    });

    it("should clear error when start typing", () => {
      simulate(subject, [
        { type: "submit" },
        {
          type: "change",
          target: "input",
          data: {
            target: {
              value: "s"
            }
          }
        }
      ]);

      expect(
        subject,
        "queried for first",
        "input",
        "not to have class",
        "error"
      );
    });

    it("should pass validation", () => {
      simulate(subject, [
        {
          type: "change",
          target: "input",
          data: { target: { value: "jason" } }
        },
        {
          type: "submit"
        }
      ]);

      expect(subject, "to contain no elements matching", "input.error");
    });

    it("should submit if validation passes", () => {
      simulate(subject, [
        {
          type: "change",
          target: "input",
          data: { target: { value: "jason" } }
        },
        {
          type: "submit"
        }
      ]);

      expect(handleSubmit, "to have a call exhaustively satisfying", [
        { username: "jason" }
      ]);
    });

    it("should NOT submit if validation is not passed", () => {
      simulate(subject, [
        {
          type: "change",
          target: "input",
          data: { target: { value: "ja" } }
        },
        {
          type: "submit"
        }
      ]);

      expect(handleSubmit, "was not called");
    });

    it("should validate while typing", () => {
      const { subject } = getInstance(
        <Enfrom
          initial={{ username: "" }}
          validation={{
            username: ({ username }) =>
              username.length < 3 ? "Min 3 chars" : false
          }}
        >
          {({ values, errors, onChange, onSubmit, validateField }) => (
            <form
              onSubmit={() => {
                onSubmit(handleSubmit);
              }}
            >
              <input
                className={errors.username ? "error" : ""}
                type="text"
                value={values.username}
                onChange={e => {
                  onChange("username", e.target.value);
                  validateField("username");
                }}
              />
            </form>
          )}
        </Enfrom>
      );

      simulate(subject, [
        {
          type: "submit"
        },
        // should still display an error
        {
          type: "change",
          target: "input",
          data: { target: { value: "ja" } }
        }
      ]);

      expect(subject, "queried for first", "input", "to have class", "error");
    });
  });

  describe("with full featured form", () => {
    let subject = null;
    let handleSubmit = null;

    beforeEach(() => {
      handleSubmit = sinon.stub().named("handleSubmit");
      subject = getInstance(
        <Enfrom
          initial={{
            email: "",
            password: "",
            repeatPassword: "",
            age: "empty",
            bio: "",
            news: false
          }}
          validation={{
            email: ({ email }) =>
              !/^[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,125}[a-zA-Z]{2,63}$/.test(
                email
              )
                ? "Enter valid email address!"
                : false,
            password: ({ password, repeatPassword }) => {
              if (password.length < 6) {
                return "Password must be at least 6 chars in length!";
              } else if (password !== repeatPassword) {
                return "Password doesn't match!";
              }
              return false;
            },
            repeatPassword: ({ repeatPassword }) =>
              repeatPassword.length < 6
                ? "Password must be at least 6 chars in length!"
                : false,
            age: ({ age }) =>
              age === "empty" ? "Please select an option!" : false,
            bio: ({ bio }) =>
              bio.length > 140 ? "Try to be shorter (max 140)!" : false
          }}
        >
          {({
            values,
            errors,
            onChange,
            onSubmit,
            clearError,
            clearErrors,
            isDirty,
            reset
          }) => (
            <div className="form">
              <div>
                <input
                  data-test-type="field"
                  type="text"
                  placeholder="Email"
                  value={values.email}
                  onChange={e => {
                    onChange("email", e.target.value);
                  }}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div>
                <input
                  data-test-type="field"
                  type="password"
                  placeholder="Password (min 6)"
                  value={values.password}
                  onChange={e => {
                    onChange("password", e.target.value);
                    if (errors.repeatPassword) {
                      clearError("repeatPassword");
                    }
                  }}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <div>
                <input
                  data-test-type="field"
                  type="password"
                  placeholder="Repeat password"
                  value={values.repeatPassword}
                  onChange={e => {
                    onChange("repeatPassword", e.target.value);
                  }}
                />
                {errors.repeatPassword && (
                  <p className="error">{errors.repeatPassword}</p>
                )}
              </div>
              <div>
                <select
                  data-test-type="field"
                  value={values.age}
                  onChange={e => {
                    onChange("age", e.target.value);
                  }}
                >
                  <option value="empty">Select age range</option>
                  <option value="10-18">10-18</option>
                  <option value="19-24">19-24</option>
                  <option value="25-35">25-35</option>
                  <option value="35-60">35-60</option>
                </select>
                {errors.age && <p className="error">{errors.age}</p>}
              </div>
              <div>
                <textarea
                  data-test-type="field"
                  placeholder="Short introduction (max 140)"
                  value={values.bio}
                  onChange={e => {
                    onChange("bio", e.target.value);
                  }}
                />
                {errors.bio && <p className="error">{errors.bio}</p>}
              </div>
              <div>
                <input
                  data-test-type="field"
                  type="checkbox"
                  checked={values.news}
                  onChange={e => {
                    onChange("news", e.target.checked);
                  }}
                />
                <label>Send me occasional product updates and offers.</label>
              </div>
              <button
                className="submit"
                onClick={() => {
                  onSubmit(handleSubmit);
                }}
              >
                Submit
              </button>
              <button
                disabled={!isDirty()}
                className="reset"
                onClick={reset}
              >
                Reset
              </button>
              <button
                disabled={!isDirty()}
                className="clear-errors"
                onClick={clearErrors}
              >
                Clear errors
              </button>
            </div>
          )}
        </Enfrom>
      ).subject;
    });

    it("should render with initial values", () => {
      expect(subject, "queried for", "[data-test-type=field]", "to satisfy", [
        `<input value="" placeholder="Email" />`,
        `<input value="" placeholder="Password (min 6)" />`,
        `<input value="" placeholder="Repeat password" />`,
        <select>
          <option value="empty">Select age range</option>
          <option value="10-18">10-18</option>
          <option value="19-24">19-24</option>
          <option value="25-35">25-35</option>
          <option value="35-60">35-60</option>
        </select>,
        `<textarea placeholder="Short introduction (max 140)"></textarea>`,
        `<input type="checkbox" />`
      ]);
    });

    it("should display error for bio field", () => {
      simulate(subject, [
        {
          type: "change",
          target: "textarea",
          data: {
            target: {
              value:
                "This is a value much longer than 140 chars. This is a value much longer than 140 chars. This is a value much longer than 140 chars. This is a value much longer than 140 chars."
            }
          }
        },
        {
          type: "click",
          target: ".submit"
        }
      ]);

      expect(
        subject,
        "queried for first",
        "textarea + .error",
        "to have text",
        "Try to be shorter (max 140)!"
      );
    });

    it("should display error when password doesn't match ", () => {
      simulate(subject, [
        {
          type: "change",
          target: "[placeholder='Password (min 6)']",
          data: {
            target: {
              value: "1234567"
            }
          }
        },
        {
          type: "change",
          target: "[placeholder='Repeat password']",
          data: {
            target: {
              value: "12345678"
            }
          }
        },
        {
          type: "click",
          target: ".submit"
        }
      ]);

      expect(
        subject,
        "queried for first",
        "[placeholder='Password (min 6)'] + .error",
        "to have text",
        "Password doesn't match!"
      );
    });

    it("should clear repeatPassword error when changing password field", () => {
      simulate(subject, [
        {
          type: "click",
          target: ".submit"
        },
        {
          type: "change",
          target: "[placeholder='Password (min 6)']",
          data: {
            target: {
              value: "1"
            }
          }
        }
      ]);

      expect(subject, "queried for", ".error", "to satisfy", [
        <p>Enter valid email address!</p>,
        <p>Please select an option!</p>
      ]);
    });

    describe("with form reset", () => {
      it("should disable reset button if form is NOT dirty", () => {
        expect(
          subject,
          "queried for first",
          ".reset",
          "to have attributes",
          "disabled"
        );
      });

      it("should enable reset button if form is dirty", () => {
        simulate(subject, {
          type: "change",
          target: "[placeholder=Email]",
          data: {
            target: {
              value: "invalid_email"
            }
          }
        });

        expect(
          subject,
          "queried for first",
          ".reset",
          "not to have attributes",
          "disabled"
        );
      });

      it("should clear all errors on reset", () => {
        simulate(subject, [
          {
            type: "change",
            target: "[placeholder=Email]",
            data: {
              target: {
                value: "invalid_email"
              }
            }
          },
          {
            type: "click",
            target: ".submit"
          },
          {
            type: "click",
            target: ".reset"
          }
        ]);

        expect(subject, "to contain no elements matching", ".error");
      });

      it("should clear all errors only", () => {
        simulate(subject, [
          {
            type: "change",
            target: "[placeholder=Email]",
            data: {
              target: {
                value: "invalid_email"
              }
            }
          },
          {
            type: "click",
            target: ".submit"
          },
          {
            type: "click",
            target: ".clear-errors"
          }
        ]);

        expect(subject, "to contain no elements matching", ".error");
      });

      it("should clear all fields on reset", () => {
        simulate(subject, [
          {
            type: "change",
            target: "[placeholder=Email]",
            data: {
              target: {
                value: "invalid_email"
              }
            }
          },
          {
            type: "change",
            target: "[placeholder='Password (min 6)']",
            data: {
              target: {
                value: "1234567"
              }
            }
          },
          {
            type: "change",
            target: "[placeholder='Repeat password']",
            data: {
              target: {
                value: "12345678"
              }
            }
          },
          {
            type: "change",
            target: "select",
            data: {
              target: {
                value: "10-18"
              }
            }
          },
          {
            type: "change",
            target: "textarea",
            data: {
              target: {
                value: "I am a dev"
              }
            }
          },
          {
            type: "change",
            target: "input[type=checkbox]",
            data: {
              target: {
                checked: true
              }
            }
          },
          {
            type: "click",
            target: ".submit"
          },
          {
            type: "click",
            target: ".reset"
          }
        ]);

        expect(subject, "queried for", "[data-test-type=field]", "to satisfy", [
          <input value="" placeholder="Email" onChange={() => {}} />,
          <input value="" placeholder="Password (min 6)" onChange={() => {}} />,
          <input value="" placeholder="Repeat password" onChange={() => {}} />,
          <select value="" onChange={() => {}}>
            <option value="empty">Select age range</option>
            <option value="10-18">10-18</option>
            <option value="19-24">19-24</option>
            <option value="25-35">25-35</option>
            <option value="35-60">35-60</option>
          </select>,
          <textarea
            placeholder="Short introduction (max 140)"
            onChange={() => {}}
          />,
          <input type="checkbox" checked={false} onChange={() => {}} />
        ]);
      });
    });

    describe("with form submission", () => {
      it("should NOT submit empty form", () => {
        simulate(subject, {
          type: "click",
          target: ".submit"
        });

        expect(handleSubmit, "was not called");
      });

      it("should display errors for empty form", () => {
        simulate(subject, {
          type: "click",
          target: ".submit"
        });

        expect(subject, "queried for", ".error", "to satisfy", [
          <p>Enter valid email address!</p>,
          <p>Password must be at least 6 chars in length!</p>,
          <p>Password must be at least 6 chars in length!</p>,
          <p>Please select an option!</p>
        ]);
      });

      it("should successfully submit", () => {
        simulate(subject, [
          {
            type: "change",
            target: "[placeholder=Email]",
            data: {
              target: {
                value: "mail@one.com"
              }
            }
          },
          {
            type: "change",
            target: "[placeholder='Password (min 6)']",
            data: {
              target: {
                value: "1234567"
              }
            }
          },
          {
            type: "change",
            target: "[placeholder='Repeat password']",
            data: {
              target: {
                value: "1234567"
              }
            }
          },
          {
            type: "change",
            target: "select",
            data: {
              target: {
                value: "10-18"
              }
            }
          },
          {
            type: "change",
            target: "textarea",
            data: {
              target: {
                value: "I am dev with #reactjs"
              }
            }
          },
          {
            type: "change",
            target: "input[type=checkbox]",
            data: {
              target: {
                checked: true
              }
            }
          },
          {
            type: "click",
            target: ".submit"
          }
        ]);

        expect(handleSubmit, "to have a call exhaustively satisfying", [
          {
            email: "mail@one.com",
            password: "1234567",
            repeatPassword: "1234567",
            age: "10-18",
            bio: "I am dev with #reactjs",
            news: true
          }
        ]);
      });
    });
  });
});
