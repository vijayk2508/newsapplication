import React from "react";
import ReactDOM from "react-dom";
import ModalContainer from "./ModalContainer";
import PropTypes from "prop-types";
import "./Modal.sass";

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.rootSelector = document.getElementById("root-modal");
    this.container = document.createElement("div");
  }

  componentDidMount() {
    if (!this.rootSelector) {
      this.rootSelector = document.createElement("div");
      this.rootSelector.setAttribute("id", "root-modal");
      document.body.appendChild(this.rootSelector);
    }
    this.rootSelector.appendChild(this.container);
  }

  componentWillUnmount() {
    // if( ! this.props.open ){
    this.rootSelector.removeChild(this.container);
    // }
  }

  render() {
    return ReactDOM.createPortal(<ModalContainer {...this.props} />, this.container);
  }
}

// To-do: Add prop-types to modal component
Modal.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  size: PropTypes.string
};

Modal.defaultProps = {
  headerClass: "",
  open: false,
  size: "medium",
  onClose: () => {},
  fullScreen: false,
  extraIcons: false,
  closeIconDisable: false
};

export default Modal;
