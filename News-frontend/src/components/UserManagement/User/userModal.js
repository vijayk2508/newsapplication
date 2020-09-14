import React, { useState } from 'react';
import Modal from "../../../UIComponents/Modal/";
import * as userManagementAction from '../../../action-reducer/userManagement/userManagementActions'
import { connect } from "react-redux";
import nextId from 'react-id-generator';

function UserModal(props) {

    const [userData, setUserData] = useState({});

    function handleSave(e) {
        e.preventDefault();
        let seletedUser = props.Userlist.filter((item) => { return item.selected === true })
        props.dispatch(userManagementAction.GetSelectUser(seletedUser));
        props.onClose();
    }


    function handleFormSubmit(e) {
        e.preventDefault();

        userData.userid = nextId();

        setUserData({
            ...userData,
            userid: nextId(),
            selected : false
        });

        console.log(userData);
        props.dispatch(userManagementAction.Add(userData));
    }

    function handleChange(e) {
        e.preventDefault();

        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }

    function toggleCardSelect(userid) {
        props.dispatch(userManagementAction.SelectUser(userid));
    }

    return (////onHide = {this.props.onClose}
        <Modal open={props.show} onClose={props.onClose} size="mini">
            <form className="myForm">
                <div className="form-group">
                    <label>User Name</label>
                    <input className="form-control input-lg" type="text" name="username" id="Username" placeholder="Username" onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group">
                    <label>User Role</label>
                    <input className="form-control input-lg" type="text" name="userrole" placeholder="User Role" onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group text-right">
                    <button name="Save" className="custom-btn" onClick={(e) => handleFormSubmit(e)}>Add</button>
                </div>
            </form>
            <div>
                <div className="row custom-row">
                    <div className="col-md-12">
                        {

                            props.Userlist.map((item, i) => (
                                <div className="card" key={item.userid} style={{ cursor: 'pointer' }}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-2">
                                                <p className="card-text">{item.userid}</p>
                                            </div>
                                            <div className="col-md-7">
                                                <p className="card-text">Name : {item.username} <br></br> Role : {item.userrole} </p>
                                            </div>
                                            <div className="col-md-3">
                                                <button name="btnSelect" className={item.selected ? "btnSelected" : "btnSelect"} onClick={() => toggleCardSelect(item.userid)}> {
                                                    item.selected ? "Selected" : "Select"
                                                }</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>))
                        }
                    </div>
                    <div className="col-md-9">
                        {
                            props.Userlist.length > 0 && <button className="custom-btn custom-btn-save" name="btnSave" onClick={(e) => handleSave(e)}>Save</button>
                        }
                    </div>
                </div>
            </div>
        </Modal>
    );

}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        Userlist: state.userManagement.Userlist,
        SelectedUserList: state.userManagement.SelectedUserList,
        userid: state.userManagement.userid
    }
};

export default connect(mapStateToProps)(UserModal);