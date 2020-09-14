import React from "react";
import UserList from './UserList/index';
import './index.css';
import User from './User/index';
function UserManangement(props) {
  return (
    <div>
      <User />
      <br></br>
      <UserList/>
    </div>
  );
};

export default UserManangement;