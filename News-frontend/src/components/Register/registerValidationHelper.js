import { areKeysDefined, validateField } from "../../helper/validator";

// To-do: Find a better way to validate otherwise it will grow too big for larger validations/more number of fields
function registerValidationHelper(registrationData) {
  const result = {};
  const presenceValidator = areKeysDefined(registrationData, [
    "firstName",
    "surname",
    "email",
    "password",
    "confirmPassword"
  ]);
  result.submitDisabled = presenceValidator.isKeyUndefined;

  if (presenceValidator.firstName) {
    const firstNameValidation = validateField(registrationData.firstName, {
      isRequired: true,
      type: "string"
    });
    if (!firstNameValidation.isRequired) {
      result.firstName = "First Name is required.";
      result.submitDisabled = true;
    }
  }

  if (presenceValidator.surname) {
    const surnameValidation = validateField(registrationData.surname, {
      isRequired: true,
      type: "string"
    });
    if (!surnameValidation.isRequired) {
      result.surname = "Surname is required.";
      result.submitDisabled = true;
    }
  }

  if (presenceValidator.email) {
    const emailValidation = validateField(registrationData.email, {
      isRequired: true,
      type: "email"
    });
    if (!emailValidation.isRequired) {
      result.email = "Email is required.";
      result.submitDisabled = true;
    } else if (!emailValidation.email) {
      result.email = "Email is not valid";
      result.submitDisabled = true;
    }
  }

  if (presenceValidator.password) {
    const passwordRegexp = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*_])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);

    const passwordValidation = validateField(registrationData.password, {
      isRequired: true,
      type: "regexp",
      regexp: passwordRegexp
    });

    if (!passwordValidation.isRequired) {
      result.password = "Password is required.";
      result.submitDisabled = true;
    } else if (!passwordValidation.regexp) {
      result.password =
        "Password should contain 8 or more characters including Lower_case, Upper_case & Special characters";
      result.submitDisabled = true;
    }
  }

  if (registrationData.password && registrationData.password !== registrationData.confirmPassword) {
    if (!registrationData.confirmPassword) {
      result.confirmPassword = "Please type the password again.";
      result.submitDisabled = true;
    }

    result.confirmPassword = "Passwords do not match";
    result.submitDisabled = true;
  }

  return result;
}

export default registerValidationHelper;
