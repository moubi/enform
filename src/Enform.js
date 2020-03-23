import { PureComponent } from "react";
import PropTypes from "prop-types";

const errorsFromInitialValues = initial =>
  Object.keys(initial).reduce(
    (errors, field) => ({ ...errors, [field]: false }),
    {}
  );

export default class Enform extends PureComponent {
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
          onValid(this.state.values);
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
        // Returning the oposite: is the field valid
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
    // Use an updater function here since this method is often used in
    // combination with onChange(). Both are setting state, so we don't
    // want to lose changes.
    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        [name]: false
      }
    }));
  }

  onSubmit(submitCallback) {
    this.validate(values => {
      if (typeof submitCallback === "function") {
        submitCallback(values);
      }
    });
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

  render() {
    const { values, errors } = this.state;
    const { children } = this.props;

    return children({ values, errors, ...this.handlers });
  }
}

Enform.propTypes = {
  children: PropTypes.func.isRequired,
  initial: PropTypes.object.isRequired,
  validation: PropTypes.object
};
