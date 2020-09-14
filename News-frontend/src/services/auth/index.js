/*
  This file exposes an wrapper function / api for any network request:
    API - sendApiRequest(apiParams)
    @params - apiParams of type `apiParamsSchema`
    You can refer to the apiParamsSchema and send an `apiParams` object accordingly.
    If you send any incorrect object, an exception will be thrown.

    This abstracts out the use of a specific network request library/function ( like axios/fetch/request, etc ) and makes the code flexible to
    any future changes irrespective of any library/function being used.
*/

import { Cookies } from "react-cookie";
import axios from "axios";
import { struct } from "superstruct";
import { FLASK_PORT } from "../../constants/portConstants";

export const cookies = new Cookies();

axios.defaults.baseURL = FLASK_PORT;
axios.defaults.headers.common.Authorization = cookies.get("SID");
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

// export const Axios = axios;

// Use this config as the config param of the axios request for any general Network request
export const config = {
  headers: {
    Authorization: cookies.get("SID"),
    "Content-Type": "application/json"
  }
};

// Use this config as the config param of the axios request for any file-related Network request
export const fileConfig = {
  headers: {
    Authorization: cookies.get("SID"),
    "Content-Type": "multipart/form-data"
  }
};

// To-do: Need to generate different messages according to different error codes
function generateAPIErrorMessage(exception) {
  // Need to generate different messages according to different error codes
  return exception.message;
}

let apiParamsSchema;

// To-do: Find a better library for validation
if (process.env.NODE_ENV !== "production") {
  apiParamsSchema = struct({
    url: "string",
    method: "string",

    baseURL: "string?",

    transformRequest: "function?",
    transformResponse: "function?",
    headers: "object?",
    params: "object?",
    paramsSerializer: "function?",

    data: "object?",

    timeout: "number?",
    withCredentials: "boolean?",
    adapter: "object?",
    auth: "object?",
    responseType: "object?",
    xsrfCookieName: "string?",
    xsrfHeaderName: "string?",
    onUploadProgress: "function?",
    onDownloadProgress: "function?",
    maxContentLength: "number?",
    validateStatus: "function?",
    maxRedirects: "number?",
    socketPath: "string?",
    httpAgent: "object?",
    httpsAgent: "object?",
    proxy: "object?",
    cancelToken: "object?"
  });
}

export default async function sendApiRequest(apiParams) {
  //if (process.env.NODE_ENV !== "production") {
    debugger
    apiParamsSchema(apiParams); // throws error if anything is not valid
 // }
  try {
    const response = await axios(apiParams);

    if (response.data.status === 200) {
      return {
        status: "success",
        data: response.data
      };
    } else {
      const errorObject = {
        status: "error",
        message: generateAPIErrorMessage(response),
        exceptionObject: response
      };
      return errorObject;
    }
  } catch (exception) {
    const errorObject = {
      status: "error",
      message: generateAPIErrorMessage(exception),
      exceptionObject: exception
    };
    return errorObject;
  }
}
