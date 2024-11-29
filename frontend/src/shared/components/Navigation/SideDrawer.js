import "./SideDrawer.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

export const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );
  return createPortal(content, document.getElementById("drawer-hook"));
};
