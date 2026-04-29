import {
  // createBrowserRouter,
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
import { useContext } from "react";
import { ApiContext } from "./context/context";
import Search from "./components/Search/Search";
// Protected Route
function ProtectedRout(props) {
  // context from ApiContext \\
  const { loggedUserData, isLoading } = useContext(ApiContext);

  if (isLoading) return;
  if (loggedUserData != null) {
    return <>{props.children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}

function App() {
  // createBrowserRouter => Client side
  // createHashRouter => Server side
  const router = createHashRouter([
    {
      path: "",
      element: <Navbar />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRout>
              <Home />
            </ProtectedRout>
          ),
        },
        {
          path: "/home",
          element: (
            <ProtectedRout>
              <Home />
            </ProtectedRout>
          ),
        },
        {
          path: "/movies",
          element: (
            <ProtectedRout>
              <Movies />
            </ProtectedRout>
          ),
        },
        {
          path: "/tv",
          element: (
            <ProtectedRout>
              <TvShow />
            </ProtectedRout>
          ),
        },
        {
          path: "/details/:media/:id",
          element: (
            <ProtectedRout>
              <Details />
            </ProtectedRout>
          ),
        },
        {
          path: "/search",
          element: (
            <ProtectedRout>
              <Search />
            </ProtectedRout>
          ),
        },
        { path: "/login", element: <Login /> }, // No call => getLoggedInUserData() --> because i just need the reference function
        { path: "/signup", element: <Signup /> },
      ],
    },
    { path: "*", element: <Notfound /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
