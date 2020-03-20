import React, { PureComponent } from "react";
import PropTypes from "prop-types";

const errorsFromInitialValues = initial =>
  Object.keys(initial).reduce(
    (errors, field) => ({ ...errors, [field]: false }),
    {}
  );

export default class ReForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      values: { ...props.initial },
      errors: { ...errorsFromInitialValues(props.initial) }
    };

    this.handlers = {
      onChange: this.onChange.bind(this),
      onSubmit: this.onSubmit.bind(this),
      isDirty: this.isDirty.bind(this),
      validateField: this.validateField.bind(this),
      clearError: this.clearError.bind(this)
    };
  }

  isDirty() {
    const { initial } = this.props;
    const fields = Object.keys(initial);
    return fields.some(field => initial[field] !== this.state.values[field]);
  }

  validate(onValid = () => {}) {
    const { validation } = this.props;
    if (!validation) return true;
    const { values, errors } = this.state;
    const newErrors = {};

    for (let i in validation) {
      newErrors[i] = validation[i](values);
    }

    this.setState(
      {
        errors: {
          ...errors,
          ...newErrors
        }
      },
      () => {
        if (this.isValid()) {
          onValid();
        }
      }
    );
  }

  validateField(name) {
    const { values, errors } = this.state;

    if (values[name]) {
      const { validation } = this.props;

      if (typeof validation[name] === "function") {
        const isInvalid = validation[name](values);
        this.setState({
          errors: {
            ...errors,
            [name]: isInvalid
          }
        });
        // Retirning the oposite: is the field valid
        return !isInvalid;
      }
      return true;
    }
  }

  isValid() {
    const { errors } = this.state;
    return !Object.values(errors).some(err => err);
  }

  clearErrors() {
    this.setState({
      ...errorsFromInitialValues(this.props.initial)
    });
  }

  clearError(name) {
    this.setState({
      errors: {
        ...this.state.errors,
        [name]: false
      }
    });
  }

  onSubmit(submitCallback) {
    if (typeof submitCallback === "function") {
      this.validate(() => {
        submitCallback(this.state.values);
      });
    }
  }

  onChange(name, value) {
    this.setState({
      values: {
        ...this.state.values,
        [name]: value
      },
      errors: {
        ...this.state.errors,
        [name]: false
      }
    });
  }

  onValidate(name, validationFunction) {
    const { values, errors } = this.state;

    if (typeof validationFunction === "function") {
      this.setState({
        errors: {
          ...errors,
          [name]: validationFunction(values[name])
        }
      });
    }
  }

  render() {
    const { values, errors } = this.state;
    const { children, className } = this.props;

    return (
      <form
        className={className || null}
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        {children({ values, errors, ...this.handlers })}
      </form>
    );
  }
}

ReForm.propTypes = {
  children: PropTypes.func.isRequired,
  initial: PropTypes.object.isRequired,
  className: PropTypes.string,
  validation: PropTypes.object
};
