import produce from "immer";
import userConstants from "./userManagementConstants";
import { SelectUser } from "./userManagementActions";

const initialState = {
  Userlist: [],
  SelectedUserList: [],
};

export const userManagementReducer = produce((state, action) => {
  switch (action.type) {
    case userConstants.CREATE: 
      let currentUserData = action.data;

      let userData = state.Userlist
      userData.push(currentUserData)
      break;

    case userConstants.SELECTUSER:
      console.log('reduceer',action.userid )
      // let tempSelectUser = state.Userlist
      // tempSelectUser=  tempSelectUser.map((user) => {
      //   return user.userid === action.userid ? { ...user, selected: !user.selected } : user;
      // });
      state.Userlist = state.Userlist.map((user) => {
        console.log('userlist', user)
        return user.userid === action.userid ? { ...user, selected: !user.selected } : user;
      });
      break;

    case userConstants.GETSELECTUSER:
      // let tempSelectedUser = state.SelectedUserList
      // tempSelectedUser = action.data;

      state.SelectedUserList = action.data;
      break;

    default: break;
  }
}, initialState);