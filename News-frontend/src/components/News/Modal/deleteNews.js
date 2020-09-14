import React, { useState, useEffect } from 'react';
import Modal from "../../../UIComponents/Modal/";
import newsConstants from '../../../action-reducer/news/newsConstants';

function DeleteNewsModal(props) {

    function handleFormSubmit(e) {
        e.preventDefault();
        let data ={};
        if(props.crudAction.actionType==newsConstants.DeleteNews){
            data.id=props.crudAction.id
        }
        props.NewsCrudActions(props.NewsDataArray, data, props.crudAction.actionType);
        props.onClose();
    }


    return (////onHide = {this.props.onClose}
        <Modal open={props.show} onClose={props.onClose} size="mini">
            <form className="myForm">
                <div className="form-group">
                    <label>Do you want to delete this news?</label>
                </div>
                <div className="form-group text-right">
                    <button name="Delete" className="custom-btn" onClick={(e) => handleFormSubmit(e)}>Delete</button>
                </div>
            </form>
        </Modal>
    );

}

export default DeleteNewsModal;