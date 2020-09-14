import React, { Component } from 'react';
import Modal from "../../../UIComponents/Modal";
import { connect } from "react-redux";
import './viewUserModal.css';

function ViewUserListModal(props) {
        return (
            <Modal open={props.show} onClose={props.onClose} size="mini">
                <br></br>
                Selected UserList : {props.SelectedUserList.length}
                <br></br>
                <div className="row">
                    <div className="col-md-12">
                        {props.SelectedUserList.length>0?  
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
                            )): null
                        }
                    </div>
                </div>
            </Modal>
        );
    }



const mapStateToProps = (state) => {
    return state.userManagement
}

export default connect(mapStateToProps)(ViewUserListModal);