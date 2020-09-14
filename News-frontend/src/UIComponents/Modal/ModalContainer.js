import React, { Component } from "react";
import PropTypes from "prop-types";

const modalBackground = {
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  background: "transparent",
  zIndex: "99999",
  padding: 0
};

const modalDialog = {
  position: "fixed",
  width: "auto",
  height: "auto",
  background: "white",
  overflow: "hidden",
  borderRadius: "10px",
  // top: '20%',
  // left: '10%',
  // right: '10%',
  // bottom: '20%',
  // textAlign: 'center',
  // backgroundColor: 'rgba(250, 250, 250, 1)',
  boxShadow: "0 5px 20px rgba(00,00,00, 0.16)",
  zIndex: "99999"
};

const modalFullDialog = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  // textAlign: 'center',
  // backgroundColor: 'rgba(250, 250, 250, 1)',
  // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.75)',
  zIndex: "99999",
  width: "100%",
  padding: 0
};

const headerStyle = {
  //position: "absolute",
  //top: "15px",
  //left: "50%",
  //transform: "translateX(-50%)",
  background: "#fff",
  color: "#000",
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'space-between',
  fontSize: "1.5rem",
  minHeight: "35px",
  width: "100%"
};

const headerText = {
  //position: "absolute",
  //left: "50%",
  textTransform: "capitalize",
  transform: "translate(-50%, 0)",
  fontSize: "16px",
  fontFamily: "interbold",
  color: "#000B19"
  // padding: '25px',
};

const containerStyle = {
  micro: {
    width: "30vw"
  },
  mini: {
    width: "40vw"
  },
  small: {
    width: "55vw"
  },
  medium: {
    height: "70vh",
    width: "70vw"
  },
  large: {
    height: "80vh",
    width: "80vw"
  },
  xlarge: {
    height: "90vh",
    width: "90vw"
  }
};

class ModalContainer extends Component {
  render() {
    let { size, closeIconDisable } = this.props;
    let containerSize =
      size && size !== "custom"
        ? { ...containerStyle[size] }
        : { height: this.props.height, width: this.props.width };
    let modalDialogStyle = this.props.fullScreen
      ? modalFullDialog
      : { ...modalDialog, ...containerSize };
    // if (this.props.modalDialogStyle) {
    //   modalDialogStyle = {
    //     ...modalDialogStyle,
    //     ...this.props.modalDialogStyle
    //   };
    // }
    return this.props.open ? (
      <div
        className="custom-modal-container"
        onWheel={ev => {
          ev.stopPropagation();
        }}
      >
        <div className="modal-background" style={modalBackground} />
        <div
          role="dialog"
          className={`modal-dialog-content ${this.props.headerClass}`}
          style={modalDialogStyle}
        >
          {this.props.header !== undefined && (
            <header style={headerStyle}>
              <span style={headerText}>{this.props.header}</span>
            </header>
          )}
          {/* {this.props.extraIcons ? [1,2,3,4].map( i => <span className="option" style={{float: "right", display: "inline-block"}}>{i}</span>) : null} */}
          {!closeIconDisable ? (
            <div onClick={() => this.props.onClose()} className="option">
              <i className="fa fa-close" />
            </div>
          ) : null}
          <div className="custom-modal-content">{this.props.children}</div>
        </div>
      </div>
    ) : null;
  }
}

ModalContainer.propTypes = {
  children: PropTypes.element.isRequired,
  // header: PropTypes.string,
  size: PropTypes.string
};

ModalContainer.defaultProps = {
  headerClass: "",
  size: "medium",
  onClose: () => {},
  fullScreen: false,
  extraIcons: false,
  closeIconDisable: false
};

export default ModalContainer;
