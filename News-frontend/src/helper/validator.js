import validate from "validate.js";

export function areKeysDefined(validationObject, keys) {
  const validationResult = {};
  keys.forEach(key => {
    if (validate(validationObject, { [key]: { presence: true } }) === undefined) {
      validationResult[key] = true;
    } else {
      validationResult.isKeyUndefined = true;
    }
  });

  return validationResult;
}

// validatorOptions = {
//   isRequired: bool,
//   type: oneOf[("string", "regexp", "number", "email", "boolean", "function", "array")],
//   regexp: RegExp,
//   minLength?: number,
//   maxLength?: number
// };

export function validateField(value, validatorOption) {
  const validationResult = {};
  if (validatorOption.isRequired && !value) {
    validationResult.isRequired = false;
    return validationResult; // Returning the result as it is empty so there is no use to go further
  } else {
    validationResult.isRequired = true;
    switch (validatorOption.type) {
      case "string":
        validationResult.string = validate.isString(value);
        break;
      case "number":
        validationResult.number = validate.isNumber(value);
        break;
      case "email":
        validationResult.email = !validate(
          { emailId: value },
          {
            emailId: {
              email: true
            }
          }
        );
        break;
      case "regexp":
        if (validatorOption.regexp && validatorOption.regexp.test) {
          validationResult.regexp = validatorOption.regexp.test(value);
        } else {
          if (!validatorOption.regexp.test) {
            throw new Error("`regexp` is not a valid regular expression");
          } else {
            throw new Error("Regular expression not provided. Key `regexp` is undefined");
          }
        }
        break;
      case "boolean":
        validationResult.boolean = validate.isBoolean(value);
        break;
      case "function":
        validationResult.function = validate.isFunction(value);
        break;
      case "array":
        validationResult.array = validate.isArray(value);
        break;
      default:
        return;
    }
    if (validatorOption.minLength) {
      const minConstraint = {
        length: validatorOption.minLength
      };
      validationResult.minLength = validate(value, minConstraint);
    }
    if (validatorOption.maxLength) {
      const maxConstraint = {
        length: validatorOption.maxLength
      };
      validationResult.maxLength = validate(value, maxConstraint);
    }

    return validationResult;
  }
}
