import React from "react";
import PropTypes from "prop-types";
import "./FormInputField.scss";

function FormInputField(props) {
  const { label, value, onChange, ...restProps } = props;
  return (
    <div className="form-input-field">
      <label className="field-label">{label}</label>
      <input className="field-input" value={value || ""} onChange={onChange} {...restProps} />
    </div>
  );
}

FormInputField.defaultProps = {
  value: "",
  onChange: () => {}
};

FormInputField.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

export default FormInputField;
