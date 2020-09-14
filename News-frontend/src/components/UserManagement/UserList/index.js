import React from 'react';
import { connect } from "react-redux";
import * as userManagementAction from '../../../action-reducer/userManagement/userManagementActions'

function UserList (props){
        return (
            <div className="row custom-row">
                <div className="col-md-3">
                    {
                    props.SelectedUserList.map((item, i) => (
                        <div className="card" key={item.userid} style={{ cursor: 'pointer' }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <p className="card-text">{item.userid}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="card-text">Name : {item.username} <br></br> Role : {item.userrole} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
        )
    }


//export default UserList;
const mapStateToProps = (state) => {
    console.log('mapStateToProps', state.userManagement)
    return state.userManagement
}

export default connect(mapStateToProps)(UserList);