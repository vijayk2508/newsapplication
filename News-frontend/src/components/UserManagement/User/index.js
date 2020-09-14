import React, { useState } from 'react';
import UserModal from "./userModal";
import ViewUserListModal from "./viewUserListModal";

function User(props) {
    const [showUserModal, setUserModal] = useState(false);
    const [showViewUserListModal, setViewUserListModal] = useState(false);
    return (
        <div className="container-fluid">
            <div>
                <button className="custom-btn" size="sm" onClick={() => setUserModal(true)}>   Add User </button>
                &nbsp;&nbsp;&nbsp;<button className="custom-btn" size="sm" onClick={() => setViewUserListModal(true)}>   View User </button>
            </div>
            {
                showUserModal ? <UserModal show={showUserModal} onClose={() => setUserModal()} /> : null
            }

            {
                showViewUserListModal ? <ViewUserListModal show={showViewUserListModal} onClose={() => setViewUserListModal()} /> : null
            }

        </div>
    );
}



export default User;
