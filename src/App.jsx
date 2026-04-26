import { createBrowserRouter, RouterProvider } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import Signup from "./components/Auth/Signup/Signup";
import Notfound from "./components/NotFound/Notfound";
import Movies from "./components/Movies/Movies";
import MoviesDetails from "./components/Movies/MoviesDetails/MoviesDetails";
import TvShow from "./components/TvShow/TvShow";
function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <Navbar />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/home", element: <Home /> },
        { path: "/movies", element: <Movies /> },
        { path: "/tv", element: <TvShow /> },
        { path: "/details/:id", element: <MoviesDetails /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
      ],
    },
    { path: "*", element: <Notfound /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
