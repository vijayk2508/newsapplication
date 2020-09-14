import React, { useState, useMemo } from "react";
import { Redirect } from "react-router-dom";
import classnames from "classnames";
import FormInputField from "../../UIComponents/FormInputField";
import sendApiRequest from "../../services/auth";
import apiEndpoints from "../../apiEndpoints";
import Modal from "../../UIComponents/Modal";
import registerValidationHelper from "./registerValidationHelper";
import "./Register.scss";

function Register({ onLogin, ...restProps }) {
  const [registrationData, updateRegistrationData] = useState({});
  const [currentFocusedField, updateCurrentFocused] = useState("");
  const [redirectToLogin, toggleRedirectToLogin] = useState(false);
  const [registrationStatus, updateRegistrationStatus] = useState({
    state: "",
    message: ""
  });

  function handleFocus(ev) {
    updateCurrentFocused(ev.target.id);
    updateRegistrationData({
      ...registrationData,
      [ev.target.id]: registrationData[ev.target.id] || ""
    });
  }

  function handleBlur(ev) {
    updateCurrentFocused("");
  }

  function handleChange(ev) {
    updateRegistrationData({
      ...registrationData,
      [ev.target.id]: ev.target.value
    });
  }

  function onRerouteToLogin() {
    toggleRedirectToLogin(true);
  }

  function onModalClose(ev) {
    if (registrationStatus.state === "success") {
      onRerouteToLogin();
    }

    updateRegistrationStatus({
      state: "",
      message: ""
    });
  }

  function onRegistrationSuccess(response) {
    updateRegistrationStatus({
      state: "success",
      message: response.data.message || "Signed up successfully."
    });
  }

  function onRegistrationFailed(exception) {
    updateRegistrationStatus({
      state: "error",
      message: exception.message
    });
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!registrationStatus.state) {
      // To-do: Register Validations here

      updateRegistrationStatus({
        state: "loading",
        message: "Signing up. Please wait..."
      });

      /*
        Axios - onLogin
        Endpoint - /login
        @params: email, password, onSuccess, onFailure
        @axiosParams: {
          login: {
            email,
            password
          }
        }
      */
      const response = sendApiRequest({
        url: apiEndpoints.REGISTER,
        method: "post",
        data: registrationData
      });

      if (response.status === "success") {
        onRegistrationSuccess(response);
      } else {
        onRegistrationFailed(response);
      }
    }
  }

  const errorTexts = useMemo(() => {
    return registerValidationHelper(registrationData);
  }, [registrationData]);

  return redirectToLogin ? (
    <Redirect to="/" />
  ) : (
    <div className="register-cont">
      <form onSubmit={handleSubmit}>
        <FormInputField
          type="text"
          label="First Name"
          id="firstName"
          value={registrationData.firstName}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentFocusedField !== "firstName" && errorTexts.firstName ? (
          <span className="error-text">{errorTexts.firstName}</span>
        ) : null}

        <FormInputField
          type="text"
          label="Surname"
          id="surname"
          value={registrationData.surname}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentFocusedField !== "surname" && errorTexts.surname ? (
          <span className="error-text">{errorTexts.surname}</span>
        ) : null}

        <FormInputField
          type="email"
          label="Email"
          id="email"
          value={registrationData.email}
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
          value={registrationData.password}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentFocusedField !== "password" && errorTexts.password ? (
          <span className="error-text">{errorTexts.password}</span>
        ) : null}

        <FormInputField
          type="password"
          label="Confirm Password"
          id="confirmPassword"
          value={registrationData.confirmPassword}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentFocusedField !== "password" &&
        currentFocusedField !== "confirmPassword" &&
        errorTexts.confirmPassword ? (
          <span className="error-text">{errorTexts.confirmPassword}</span>
        ) : null}

        <div className="register-footer">
          <button
            className={classnames("btn primary-btn right", {
              "btn-disabled": errorTexts.submitDisabled
            })}
            disabled={errorTexts.submitDisabled}
            type="submit"
          >
            Sign Up
            {registrationStatus.state === "loading" ? (
              <>
                {" "}
                <i className="fa fa-spinner fa-spin" />
              </>
            ) : null}
          </button>
        </div>
        <Modal
          open={registrationStatus.state === "error" || registrationStatus.state === "success"}
          onClose={onModalClose}
          size="mini"
        >
          <div className="registration-status">{registrationStatus.message}</div>
        </Modal>
      </form>
    </div>
  );
}

export default Register;
