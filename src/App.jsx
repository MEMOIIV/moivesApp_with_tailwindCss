/* eslint-disable react-hooks/set-state-in-effect */
import {
  createBrowserRouter,
  createHashRouter,
  Navigate,
  RouterProvider,
} from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import Signup from "./components/Auth/Signup/Signup";
import Notfound from "./components/NotFound/Notfound";
import Movies from "./components/Movies/Movies";
import TvShow from "./components/TvShow/TvShow";
import Details from "./components/Details/Details";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Protected Route
function ProtectedRout(props) {
  if (props.isLoading) return;
  if (props.loggedUserData != null) {
    return <>{props.children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}

function App() {
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
    getLoggedInUserData(); // ✅ important line for render error
  }, []);

  // createBrowserRouter => Client side
  // createHashRouter => Server side
  const router = createHashRouter([
    {
      path: "",
      element: <Navbar userData={loggedUserData} logoutUser={removeUserData} />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRout loggedUserData={loggedUserData}>
              <Home />
            </ProtectedRout>
          ),
        },
        {
          path: "/home",
          element: (
            <ProtectedRout
              loggedUserData={loggedUserData}
              isLoading={isLoading}
            >
              <Home userData={loggedUserData} />
            </ProtectedRout>
          ),
        },
        {
          path: "/movies",
          element: (
            <ProtectedRout
              loggedUserData={loggedUserData}
              isLoading={isLoading}
            >
              <Movies />
            </ProtectedRout>
          ),
        },
        {
          path: "/tv",
          element: (
            <ProtectedRout
              loggedUserData={loggedUserData}
              isLoading={isLoading}
            >
              <TvShow />
            </ProtectedRout>
          ),
        },
        {
          path: "/details/:media/:id",
          element: (
            <ProtectedRout
              loggedUserData={loggedUserData}
              isLoading={isLoading}
            >
              <Details />
            </ProtectedRout>
          ),
        },
        { path: "/login", element: <Login loginVer={getLoggedInUserData} /> }, // No call => getLoggedInUserData() --> because i just need the reference function
        { path: "/signup", element: <Signup /> },
      ],
    },
    { path: "*", element: <Notfound /> },
  ]);
  return (
    <GoogleOAuthProvider clientId="135828211132-a06rnbnc9h3elm8qehjr02pg8h9m20fh.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;
