import sendApiRequest from "../../services/auth";
import apiEndpoints from "../../apiEndpoints";
import loginConstants from "./loginConstants";

/*
 Axios - onLogin
 Description - Makes a login network request to the server
 Endpoint - /login
 @params: email, password, onSuccess, onFailure
 @axiosParams: {
   login: {
     email,
     password
   }
 }
*/

export function onLogin({ email, password }, onSuccess, onFailure) {
  return async function(dispatch) {
    const response = await sendApiRequest({
      url: apiEndpoints.LOGIN,
      method: "post",
      data: {
        login: { email, password }
      }
    });
    if (response.status === "success") {
      // logged in successfully
      onSuccess();
      dispatch(onLoginSuccess);
    } else {
      // error in logging in
      onFailure(response);
    }
  };
}

/*
  Action creator
*/

function onLoginSuccess() {
  return {
    type: loginConstants.LOGIN_SUCCESSFUL
  };
}

// function onLoginFailed() {
//   return {
//     type: loginConstants.LOGIN_SUCCESSFUL
//   };
// }
