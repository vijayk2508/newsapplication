import userConstants from "./userManagementConstants";

export const Add = (data) => {
      return { type: userConstants.CREATE, data: data}
}

export const Delete = (id) => {
      return { type: userConstants.DELETE, id: id }
}

export const SelectUser = userid => {
      return { type: userConstants.SELECTUSER, userid: userid }
}


export const GetSelectUser=(data)=>{
      console.log('actions',data)
    return dispatch => dispatch({type : userConstants.GETSELECTUSER , data : data})
}