import React, { useState, useEffect } from 'react';
import Modal from "../../../UIComponents/Modal/";
import { connect } from "react-redux";
import nextId from 'react-id-generator';
import newsConstants from '../../../action-reducer/news/newsConstants';

function NewsModal(props) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [NEWSData, setNEWSData] = useState({});

    function handleFormSubmit(e) {
        e.preventDefault();

        let data = {
            title,
            description
        }

        if (props.crudAction.actionType == newsConstants.EditNews) {
            data.id = props.crudAction.id
        }

        props.NewsCrudActions(props.NewsDataArray, data, props.crudAction.actionType);
        props.onClose();
    }

    useEffect(() => {
        console.log(props.crudAction.id, props.crudAction.actionType)

        if (props.crudAction.id > 0 && props.crudAction.actionType == newsConstants.EditNews) {

            let currentEditData = props.NewsDataArray.filter(obj => obj.id == props.crudAction.id)

            // setNEWSData({
            //     ...NEWSData,
            //     ...currentEditData[0]
            // });
           // console.log('current data---->',currentEditData);

              setTitle(currentEditData[0].title)
              setDescription(currentEditData[0].description)
        }

    }, [])

    function handleChange(e) {
        e.preventDefault();
        // console.log("--s????", e.target.value)
        if (e.target.name == 'title') {
            setTitle(e.target.value);
        } else {
            setDescription(e.target.value);
        }

        // setNEWSData({
        //     ...NEWSData,
        //     [e.target.id]: [e.target.value] || ""
        // });
    }

    return (////onHide = {this.props.onClose}

        console.log('edit...........', NEWSData.title, NEWSData.description),
        <Modal open={props.show} onClose={props.onClose} size="mini">
            <form className="myForm">
                <div className="form-group">
                    <label>Title</label>
                    <input className="form-control input-lg" value={title/*NEWSData.title*/} type="text" name="title" id="title" placeholder="Username" onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input className="form-control input-lg" value={description/*NEWSData.description*/} type="text" name="description" placeholder="User Role" onChange={(e) => handleChange(e)} />
                </div>
                <div className="form-group text-right">
                    <button name="Save" className="custom-btn" onClick={(e) => handleFormSubmit(e)}>{props.crudAction.actionType == newsConstants.EditNews ? 'Update' : 'Add'}</button>
                </div>
            </form>
        </Modal>
    );

}

export default NewsModal;