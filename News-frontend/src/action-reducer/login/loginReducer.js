import produce from "immer";
import loginConstants from "./loginConstants";
import { cookies } from "../../services/auth";

const initialState = {
  isLoggedIn: !!cookies.get("SID")
};

export const loginReducer = produce((state, action) => {
  switch (action.type) {
    case loginConstants.LOGIN_SUCCESSFUL:
      state.isLoggedIn = true;
      break;

    case loginConstants.LOGOUT_SUCCESSFUL:
      state.isLoggedIn = false;
      break;

    default: // for es-lint :/
  }
}, initialState);
