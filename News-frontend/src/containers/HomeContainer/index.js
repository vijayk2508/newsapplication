import React from "react";
import useLogout from "../../custom-hooks/useLogout";
import "./HomeContainer.sass";
import Modal from "../../UIComponents/Modal";

function HomeContainer(props) {
  const [logoutStatus, handleLogout, resetLogoutStatus] = useLogout();
  return (
    <div className="home-container">
      <button onClick={handleLogout}>Logout</button>
      <Modal open={logoutStatus.state} size="mini" onClose={resetLogoutStatus}>
        <div>{logoutStatus.message}</div>
      </Modal>
    </div>
  );
}

export default HomeContainer;
