import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { ApiContext } from "../context";
function API_context(props) {
  const [loggedUserData, setLoggedUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [valueSearchIn, setValueSearchIn] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Get userData from Login component
  function getLoggedInUserData() {
    const token = localStorage.getItem("token");
    const guest = localStorage.getItem("guest");

    // 🟢 case Guest
    if (guest === "true") {
      setIsGuest(true);
      setLoggedUserData(null);
      setIsLoading(false);
      return;
    }

    // 🔴 No auth
    if (!token) {
      setIsGuest(false); // 👈 مهم
      setLoggedUserData(null);
      setIsLoading(false);
      return;
    }

    // 🟢 User
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
    localStorage.removeItem("guest"); // 👈 مهم
    setLoggedUserData(null);
    setIsGuest(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getLoggedInUserData(); // ✅ important line for render error
  }, []);

  function getValueInput(e) {
    setValueSearchIn(e.target.value);
  }

  return (
    <ApiContext.Provider
      value={{
        loggedUserData,
        isLoading,
        userLogout: removeUserData,
        logVerification: getLoggedInUserData,
        apiKey: "ab6f02890a894dfd18b04c025b5de2eb",
        searchInputValue: getValueInput,
        valueSearchIn,
        isGuest,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
}
export default API_context;
