import React, { useState, useMemo } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { onLogin } from "../../action-reducer/login/loginActions";
import FormInputField from "../../UIComponents/FormInputField";
import Modal from "../../UIComponents/Modal";
import loginValidationHelper from "./loginValidationHelper";
import "./Login.scss";

function Login({ onLogin, ...restProps }) {
  const [credentials, updateCredentials] = useState({});
  const [currentFocusedField, updateCurrentFocused] = useState("");
  const [loginStatus, updateLoginStatus] = useState({
    state: "",
    message: ""
  });
  // // const [errorState, updateErrorState] = useState({
  // //   email: false,
  // //   emailInValid: false,
  // //   password: false,
  // //   passwordInValid: false
  // });

  function handleFocus(ev) {
    updateCurrentFocused(ev.target.id);
    updateCredentials({
      ...credentials,
      [ev.target.id]: credentials[ev.target.id] || ""
    });
  }

  function handleBlur(ev) {
    updateCurrentFocused("");
  }

  function handleChange(ev) {
    updateCredentials({
      ...credentials,
      [ev.target.id]: ev.target.value
    });
  }

  function onModalClose(ev) {
    updateLoginStatus({
      state: "",
      message: ""
    });
  }

  function onLoginSuccess() {
    updateLoginStatus({
      state: "success",
      message: "Logged in successfully. Please wait while we redirect you to your account."
    });
    window.location.reload();
  }

  function onLoginFailed(exception) {
    updateLoginStatus({
      state: "error",
      message: exception.message
    });
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!loginStatus.state) {
      // To-do: Register Validations here

      updateLoginStatus({
        state: "loading",
        message: "Logging in. Please wait..."
      });
      onLogin(credentials, onLoginSuccess, onLoginFailed);
    }
  }

  const errorTexts = useMemo(() => {
    return loginValidationHelper(credentials);
  }, [credentials]);

  return (
    <div className="login-cont">
      <form onSubmit={handleSubmit}>
        <FormInputField
          type="email"
          label="Email"
          id="email"
          value={credentials.email || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentFocusedField !== "email" && errorTexts.email ? (
          <span className="error-text">{errorTexts.email}</span>
        ) : null}

        <FormInputField
          type="password"
          label="Password"
          id="password"
          value={credentials.password || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentFocusedField !== "password" && errorTexts.password ? (
          <span className="error-text">{errorTexts.password}</span>
        ) : null}

        <div className="login-footer">
          <button
            className={classnames("btn primary-btn right", {
              "btn-disabled": errorTexts.submitDisabled
            })}
            disabled={errorTexts.submitDisabled}
            type="submit"
          >
            Login
            {loginStatus.state === "loading" ? (
              <>
                {" "}
                <i className="fa fa-spinner fa-spin" />
              </>
            ) : null}
          </button>
        </div>

        <Modal
          open={loginStatus.state === "error" || loginStatus.state === "success"}
          onClose={onModalClose}
          size="mini"
        >
          <div className="login-status">{loginStatus.message}</div>
        </Modal>
      </form>
    </div>
  );
}

export default connect(
  null,
  {
    onLogin
  }
)(Login);
