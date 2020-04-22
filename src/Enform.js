import { useState } from "react";
import PropTypes from "prop-types";

const errorsFromInitialValues = initial =>
  Object.keys(initial).reduce(
    (errors, field) => ({ ...errors, [field]: false }),
    {}
  );

export default function Enform({ initial, validation, children }) {
  const [values, setValues] = useState({ ...initial });
  const [errors, setErrors] = useState({ ...errorsFromInitialValues(initial) });

  function isDirty() {
    const fields = Object.keys(initial);
    return fields.some(field => initial[field] !== values[field]);
  }

  function validate(onValid = () => {}) {
    if (!validation) return true;
    const newErrors = {};

    for (let i in validation) {
      newErrors[i] = validation[i](values);
    }

    const isValid = !Object.values(newErrors).some(err => err);

    setErrors({
      ...errors,
      ...newErrors
    });

    if (isValid) {
      onValid(values);
    }
  }

  function validateField(name) {
    if (typeof values[name] !== "undefined") {
      if (typeof validation[name] === "function") {
        const isInvalid = validation[name](values);
        setErrors({
          ...errors,
          [name]: isInvalid
        });
        // Returning the oposite: is the field valid
        return !isInvalid;
      }
      return true;
    }
  }

  function clearErrors() {
    setErrors({ ...errorsFromInitialValues(initial) });
  }

  function reset() {
    setValues({ ...initial });
    clearErrors();
  }

  function clearError(name) {
    // Use an updater function here since this method is often used in
    // combination with onChange(). Both are setting state, so we don't
    // want to lose changes.
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: false
    }));
  }

  function onSubmit(submitCallback) {
    validate(values => {
      if (typeof submitCallback === "function") {
        submitCallback(values);
      }
    });
  }

  function onChange(name, value) {
    setValues({
      ...values,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: false
    });
  }

  return children({
    values,
    errors,
    onChange,
    onSubmit,
    isDirty,
    validateField,
    clearError,
    clearErrors,
    reset
  });
}

Enform.propTypes = {
  children: PropTypes.func.isRequired,
  initial: PropTypes.object.isRequired,
  validation: PropTypes.object
};
