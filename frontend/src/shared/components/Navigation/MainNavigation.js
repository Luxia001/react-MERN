import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { MainHeader } from "./MainHeader";
import "./MainNavigation.css";
import { NavLinks } from "./NavLinks";
import { SideDrawer } from "./SideDrawer";
import React, { useState } from "react";
import { Backdrop } from "../UIElement/Backdrop";

export const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };
  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler}></Backdrop>}

      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="navigation__header-nav">
          <NavLinks></NavLinks>
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          type=""
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks></NavLinks>
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};
