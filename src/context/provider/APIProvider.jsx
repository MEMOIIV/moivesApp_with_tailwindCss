import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { ApiContext } from "../context";
function API_context(props) {
  const [loggedUserData, setLoggedUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get userData from Login component
  function getLoggedInUserData() {
    const token = localStorage.getItem("token");

    if (!token) {
      // 👈 important
      setIsLoading(false);
      return;
    }

    try {
      const data = jwtDecode(token);

      setLoggedUserData(data);
    } catch (err) {
      console.log("Invalid token:", err);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }

  // Remove user data
  function removeUserData() {
    localStorage.removeItem("token");
    setLoggedUserData(null);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getLoggedInUserData(); // ✅ important line for render error
  }, []);
  return (
    <ApiContext.Provider
      value={{
        loggedUserData,
        isLoading,
        userLogout: removeUserData,
        logVerification: getLoggedInUserData,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
}
export default API_context;
