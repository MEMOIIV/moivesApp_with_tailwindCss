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
  const {
    loggedUserData,
    userLogout,
    searchInputValue,
    isGuest,
    logVerification,
  } = useContext(ApiContext);

  let navigate = useNavigate();
  function toggleNavList() {
    setOpenNav(!openNav);
  }

  function logout() {
    userLogout();
    navigate("/login");
  }

  // search input
  function handleChange(e) {
    if (e.target.value == "") {
      navigate("/home");
    } else {
      searchInputValue(e);
      navigate("/search");
    }
  }

  // gest button
  function gest() {
    localStorage.setItem("guest", "true");
    logVerification();
    navigate("/home");
  }
  return (
    <>
      <nav
        className={`shadow-xl p-1.5 capitalize flex justify-between items-center px-4 text-lg text-center fixed top-0 left-0 w-full bg-bgrColor z-50 ${!loggedUserData && !isGuest ? "py-2" : ""}`}
      >
        <Link className="text-3xl mr-4 uppercase cursor-pointer hover:text-bgTransparent transition-all duration-300">
          Nexo
        </Link>

        <div className={`w-full`}>
          {/* ul */}
          <ul
            className={`absolute top-[120%] right-[50%] translate-x-[50%] w-[90%] flex flex-col rounded-md shadow-2xl px-4 md:right-4 md:translate-x-0 md:w-[50%] 
              xl:p-0 xl:static xl:flex-row xl:top-auto xl:right-auto xl:translate-x-0 xl:w-full xl:justify-between xl:items-center xl:shadow-none
              bg-bgrColor ${openNav ? "flex" : "hidden xl:flex"}`}
          >
            {/* part one */}
            <div
              className={`navbar_link flex flex-col xl:flex-row ${!loggedUserData && !isGuest ? "hidden" : ""}`}
            >
              <Link
                to={"/home"}
                className={`w-full text-gray-300 text-[16px] border-b border-borderColor mt-2 mx-0 xl:mx-2 xl:mt-0 text-center py-1 hover:opacity-95 xl:border-none xl:w-fit xl:py-0 xl:hover:opacity-100 hover:text-bgTransparent transition-all duration-300`}
              >
                home
              </Link>
              <Link
                to={"/movies"}
                className={`w-full text-gray-300 text-[16px] border-b border-borderColor mt-2 mx-0 xl:mx-2 xl:mt-0 text-center py-1 hover:opacity-95 xl:border-none xl:w-fit xl:py-0 xl:hover:opacity-100 hover:text-bgTransparent transition-all duration-300 `}
              >
                movies
              </Link>
              <Link
                to={"/tv"}
                className={`w-full text-gray-300 text-[16px] border-b border-borderColor mt-2 mx-0 xl:mx-2 xl:mt-0 text-center py-1 hover:opacity-95 xl:border-none xl:w-fit xl:py-0 xl:hover:opacity-100 hover:text-bgTransparent transition-all duration-300 `}
              >
                tv show
              </Link>
              <Link
                to={"/networks"}
                className={`w-full text-gray-300 text-[16px] border-b border-borderColor mt-2 mx-0 xl:mx-2 xl:mt-0 text-center py-1 hover:opacity-95 xl:border-none xl:w-fit xl:py-0 xl:hover:opacity-100 hover:text-bgTransparent transition-all duration-300 `}
              >
                networks
              </Link>
              <Link
                to={"/favorite"}
                className={`w-full text-gray-300 text-[16px] border-b border-borderColor mt-2 mx-0 xl:mx-2 xl:mt-0 text-center py-1 hover:opacity-95 xl:border-none xl:w-fit xl:py-0 xl:hover:opacity-100 hover:text-bgTransparent transition-all duration-300 `}
              >
                favorite
              </Link>
            </div>

            {/* part two */}
            <div className="flex flex-col xl:flex-row items-center xl:ml-auto">
              <input
                type="text"
                className={`bg-fontColor rounded-md order-10 xl:order-0 xl:w-72 w-full text-black px-3 py-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent 
                  ${!loggedUserData && !isGuest ? "hidden" : ""}`}
                placeholder="search"
                onChange={handleChange}
              />
              <div
                className={`flex items-center justify-evenly w-full py-3 order-12 xl:order-0 ${!loggedUserData && !isGuest ? "hidden" : ""}`}
              >
                <XLogoIcon
                  className={`hover:text-bgTransparent transition-all duration-300 cursor-pointer size-6 mx-2`}
                />
                <FacebookLogoIcon
                  className={`hover:text-bgTransparent transition-all duration-300 cursor-pointer size-6 mx-2`}
                />
                <SpotifyLogoIcon
                  className={`hover:text-bgTransparent transition-all duration-300 cursor-pointer size-6 mx-2`}
                />
                <InstagramLogoIcon
                  className={`hover:text-bgTransparent transition-all duration-300 cursor-pointer size-6 mx-2`}
                />
              </div>
              {loggedUserData != null || isGuest != false ? (
                ""
              ) : (
                <>
                  <Link to={"/login"} className={`${styleNav.navList}`}>
                    login
                  </Link>
                  <Link
                    to={"/signup"}
                    className={`${styleNav.navList} border-b border-borderColor xl:mr-4 xl:mb-0`}
                  >
                    signUp
                  </Link>
                  <li
                    className={`${styleNav.navList} border-none pb-2 xl:pb-0 xl:mr-4 xl:mb-0 cursor-pointer`}
                    onClick={gest}
                  >
                    guest
                  </li>
                </>
              )}
              <li
                className={`${styleNav.navList} border-none mb-2 xl:mr-4 xl:mb-0 cursor-pointer ${!loggedUserData && !isGuest ? "hidden" : ""}`}
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
