import { validateField, areKeysDefined } from "../../helper/validator";

function loginValidationHelper(credentials) {
  const result = {};
  const presenceValidator = areKeysDefined(credentials, ["email", "password"]);
  result.submitDisabled = presenceValidator.isKeyUndefined;

  if (presenceValidator.email) {
    const emailValidation = validateField(credentials.email, { isRequired: true, type: "email" });
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

    const passwordValidation = validateField(credentials.password, {
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

  return result;
}

export default loginValidationHelper;
