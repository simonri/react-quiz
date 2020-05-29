import React, { useRef, useState, useEffect } from "react";
import {
  Navbar,
  NavItem,
  NavLink,
  NavbarBrand,
  DropdownMenu,
  NavbarToggler,
  Collapse,
  Container,
} from "reactstrap";

import useAuth from "../services/authentication";

import $ from "jquery";
import "bootstrap";

import { HashLink } from "react-router-hash-link";

const useWindowScroll = () => {
  const [currentScrollTop, setScrollTop] = React.useState(
    $(window).scrollTop()
  );

  React.useEffect(() => {
    $(window).scroll(function () {
      setScrollTop($(window).scrollTop());
    });
    return () => $(window).off("scroll");
  }, []);

  return currentScrollTop;
};

export default (props) => {
  const [windowWidth] = useState($(window).width());
  const auth = useAuth();

  const onLinkClick = function (event) {
    if (
      windowWidth < 991 &&
      !event.target.classList.contains("dropdown-toggle")
    ) {
      $(".navbar-collapse").collapse("hide");
    }
  };

  const onAnchorClick = function (event) {
    onLinkClick.call(this, event);

    if (event.target.hash !== "") {
      event.preventDefault();
      const hash = event.target.hash;
      $("html, body").animate(
        {
          scrollTop:
            $(hash).offset().top - ($(window).width() >= 991 ? 75 : 50),
        },
        1000,
        function () {}
      );
      return false;
    }
  };

  return (
    <Navbar className="navbar-expand-lg navbar-light fixed-top bg-white">
      <Container id="navbar-main">
        <NavbarBrand href="/">Kahoot</NavbarBrand>
        <Collapse navbar className="default-nav" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto" id="mymenu">
            {auth.loggedIn ? (
              <>
                <NavItem>
                  <NavLink
                    onClick={onLinkClick}
                    href="/create_quiz"
                    rel="noopener noreferrer"
                  >
                    Create Quiz
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    onClick={(e) => {
                      auth.logout();
                      props.history.push("/");
                      e.preventDefault();
                    }}
                    href="/logout"
                    rel="noopener noreferrer"
                  >
                    Logout
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink
                    onClick={onLinkClick}
                    href="/login"
                    rel="noopener noreferrer"
                  >
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    onClick={onLinkClick}
                    href="/register"
                    rel="noopener noreferrer"
                  >
                    Register
                  </NavLink>
                </NavItem>
              </>
            )}
          </ul>
        </Collapse>
      </Container>
    </Navbar>
  );
};
