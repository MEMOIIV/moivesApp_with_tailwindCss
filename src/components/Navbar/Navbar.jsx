import React, { useContext, useState } from "react";
import styleNav from "./navbar.module.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  ListIcon,
  XLogoIcon,
  FacebookLogoIcon,
  SpotifyLogoIcon,
  InstagramLogoIcon,
} from "../../utils/icons";
import { ApiContext } from "../../context/context";
export default function Navbar() {
  const [openNav, setOpenNav] = useState(false);

  // context from ApiContext \\
  const { loggedUserData, userLogout } = useContext(ApiContext);

  let navigate = useNavigate();
  function toggleNavList() {
    setOpenNav(!openNav);
  }

  function logout() {
    userLogout();
    navigate("/login");
  }
  return (
    <>
      <nav
        className={`${styleNav.container_navbar} z-50 ${loggedUserData == null ? "py-2" : ""}`}
      >
        <Link className="text-3xl mr-4 uppercase cursor-pointer hover:text-bgTransparent transition-all duration-300">
          Nexo
        </Link>

        <div className={`w-full`}>
          {/* ul */}
          <ul
            className={`${styleNav.navbar} ${openNav ? "flex" : "hidden xl:flex"}`}
          >
            {/* part one */}
            <div
              className={`navbar_link flex flex-col xl:flex-row ${loggedUserData == null ? "hidden" : ""}`}
            >
              <Link to={"/home"} className={`${styleNav.navList}`}>
                home
              </Link>
              <Link to={"/movies"} className={`${styleNav.navList} `}>
                movies
              </Link>
              <Link to={"/tv"} className={`${styleNav.navList} `}>
                tv show
              </Link>
              <Link to={""} className={`${styleNav.navList} `}>
                people
              </Link>
              <Link to={""} className={`${styleNav.navList} `}>
                about
              </Link>
              <Link to={""} className={`${styleNav.navList} `}>
                networks
              </Link>
            </div>

            {/* part two */}
            <div className="flex flex-col xl:flex-row items-center xl:ml-auto">
              <input
                type="text"
                className={`${styleNav.styleInput} ${loggedUserData == null ? "hidden" : ""}`}
                placeholder="search"
              />
              <div
                className={`${styleNav.containerIcon} ${loggedUserData == null ? "hidden" : ""}`}
              >
                <XLogoIcon className={`${styleNav.iconNavStyle}`} />
                <FacebookLogoIcon className={`${styleNav.iconNavStyle}`} />
                <SpotifyLogoIcon className={`${styleNav.iconNavStyle}`} />
                <InstagramLogoIcon className={`${styleNav.iconNavStyle}`} />
              </div>
              {loggedUserData != null ? (
                ""
              ) : (
                <>
                  <Link to={"/login"} className={`${styleNav.navList}`}>
                    login
                  </Link>
                  <Link
                    to={"/signup"}
                    className={`${styleNav.navList} border-none mb-2 xl:mr-4 xl:mb-0`}
                  >
                    signUp
                  </Link>
                </>
              )}
              <li
                className={`${styleNav.navList} border-none mb-2 xl:mr-4 xl:mb-0 cursor-pointer ${loggedUserData == null ? "hidden" : ""}`}
                onClick={logout}
              >
                logout
              </li>
            </div>
          </ul>
        </div>

        <div
          className="block xl:hidden cursor-pointer hover:text-bgTransparent duration-300"
          onClick={toggleNavList}
        >
          <ListIcon size={34} />
        </div>
      </nav>
      <div
        className=""
        onClick={() => {
          setOpenNav(false);
        }}
      >
        <Outlet />
      </div>
    </>
  );
}
