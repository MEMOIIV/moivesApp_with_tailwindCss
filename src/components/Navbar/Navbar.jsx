import React, { useState } from "react";
import styleNav from "./navbar.module.css";
import { Link, Outlet } from "react-router-dom";
import {
  ListIcon,
  XLogoIcon,
  FacebookLogoIcon,
  SpotifyLogoIcon,
  InstagramLogoIcon,
} from "../../utils/icons";
export default function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  function toggleNavList() {
    setOpenNav(!openNav);
  }
  return (
    <>
      <nav className={`${styleNav.container_navbar} z-50`}>
        <Link
          className="text-3xl mr-4 uppercase cursor-pointer hover:text-bgTransparent transition-all duration-300"
          to={"/"}
        >
          Nexo
        </Link>

        <div className={`w-full`}>
          {/* ul */}
          <ul
            className={`${styleNav.navbar} ${openNav ? "flex" : "hidden xl:flex"}`}
          >
            {/**/}

            {/* part one */}
            <div className="navbar_link flex flex-col xl:flex-row">
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
            <div className="flex flex-col xl:flex-row items-center">
              <input
                type="text"
                className="bg-fontColor rounded-md order-10 xl:order-0 xl:w-72 w-full text-black px-3 py-1 focus:outline-none focus:ring-2 focus:ring-bgTransparent"
                placeholder="search"
              />
              <div className={styleNav.containerIcon}>
                <XLogoIcon className={`${styleNav.iconNavStyle}`} />
                <FacebookLogoIcon className={`${styleNav.iconNavStyle}`} />
                <SpotifyLogoIcon className={`${styleNav.iconNavStyle}`} />
                <InstagramLogoIcon className={`${styleNav.iconNavStyle}`} />
              </div>
              <Link to={"/login"} className={`${styleNav.navList}`}>
                login
              </Link>
              <Link
                to={"/signup"}
                className={`${styleNav.navList} border-none mb-2 xl:mr-4 xl:mb-0`}
              >
                signUp
              </Link>
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
        <Outlet/>
      </div>
    </>
  );
}
