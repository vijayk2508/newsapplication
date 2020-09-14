import { useEffect, useState } from "react";
import sendApiRequest, { cookies } from "../../services/auth";

const logoutStatusInit = {
  state: "",
  message: ""
};

function useLogout() {
  const [logoutStatus, updateLogoutStatus] = useState(logoutStatusInit);

  useEffect(() => {
    if (logoutStatus.state === "success") {
      cookies.remove("SID");
      updateLogoutStatus(logoutStatusInit);
      window.location.reload();
    }
  }, [logoutStatus]);

  function resetLogoutStatus() {
    updateLogoutStatus(logoutStatusInit);
  }

  async function handleLogout(ev) {
    updateLogoutStatus({ state: "loading", message: "Please wait while we log you out." });
    const response = await sendApiRequest({
      url: "logout",
      method: "post",
      data: {
        logout: cookies.get("SID")
      }
    });

    if (response.status === "success") {
      updateLogoutStatus({ state: "success", message: "Logged out successfully." });
    } else {
      updateLogoutStatus({ state: "failed", message: "Failed to log out." });
    }
  }

  return [logoutStatus, handleLogout, resetLogoutStatus];
}

export default useLogout;
