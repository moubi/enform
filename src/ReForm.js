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
      onChange: this.onChange.bind(this)
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate() {
    const { validation } = this.props;
    if (!validation) return true;

    const { values, errors } = this.state;
    const newErrors = {};

    for (let i in validation) {
      newErrors[i] = validation[i](values);
    }

    this.setState({
      errors: {
        ...errors,
        ...newErrors
      }
    });

    return this.isValid();
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

  handleSubmit(e) {
    e.preventDefault();
    const { onSubmit } = this.props;
    if (onSubmit) {
      const isValid = this.validate();
      if (isValid) {
        onSubmit(this.state.values);
      }
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
    const { children } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        {children({ values, errors, ...this.handlers })}
      </form>
    );
  }
}

ReForm.propTypes = {
  children: PropTypes.func.isRequired,
  initial: PropTypes.object.isRequired,
  validation: PropTypes.object,
  onSubmit: PropTypes.func
};
