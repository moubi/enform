import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

// Object props does have an order
const sortObj = obj =>
  Object.keys(obj)
    .sort()
    .reduce(function(result, key) {
      result[key] = obj[key];
      return result;
    }, {});

const errorsFromInitialValues = initial =>
  Object.keys(initial).reduce(
    (errors, field) => ({ ...errors, [field]: false }),
    {}
  );

export default function Enform({ initial, validation, children }) {
  const [values, setValues] = useState({ ...initial });
  const [errors, setErrors] = useState(() => errorsFromInitialValues(initial));
  const ref = useRef(sortObj(initial));

  const reset = useCallback(() => {
    setValues({ ...initial });
    setErrors(errorsFromInitialValues(initial));
  }, [initial]);

  useEffect(() => {
    // That should cover most of the use cases.
    // JSON.stringify is reliable here.
    // Enform will sort before compare stringified versions of the two object
    // That gives a higher chance for success without the need of deep equal.
    // Note: JSON.stringify doesn't handle javascript Sets and Maps.
    // Using such in forms is considered more of an edge case and should be
    // handled by consumer components by turning these into an object or array
    const sortedInitial = sortObj(initial);
    if (JSON.stringify(sortedInitial) !== JSON.stringify(ref.current)) {
      reset();
      ref.current = sortedInitial;
    }
  }, [initial, reset]);

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
    setErrors(errorsFromInitialValues(initial));
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
    errors[name] && clearError(name);
  }

  // This method is usually used with API calls to programmatically set
  // field errors comming as a payload and not as a result of direct user input
  function setErrorsIfFieldsExist(newErrors) {
    if (typeof newErrors !== "object") return false;
    const errorsCopy = { ...errors };

    Object.keys(newErrors).forEach(fieldName => {
      if (fieldName in errorsCopy) {
        errorsCopy[fieldName] = newErrors[fieldName];
      }
    });

    setErrors({ ...errorsCopy });
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
    setErrors: setErrorsIfFieldsExist,
    reset
  });
}

Enform.propTypes = {
  children: PropTypes.func.isRequired,
  initial: PropTypes.object.isRequired,
  validation: PropTypes.object
};
