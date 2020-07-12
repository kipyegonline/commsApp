import React, { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import PropTypes from "prop-types";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Button from "@material-ui/core/Button";
import styles from "./css/nav.module.css";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">DV</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className={`mr-auto ${styles.navp}`} navbar>
          <NavItem>
            <Link href="/">
              <NavLink>Home</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/about">
              <NavLink>About</NavLink>
            </Link>
          </NavItem>

          <NavItem>
            <Link href="/addstats">
              <NavLink>Contact</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/sandbox">
              <NavLink>Sandbox</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/users">
              <NavLink>Users</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/admin/add-departments">
              <NavLink>Departments</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/issues">
              <NavLink>Issues</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Button
              color="secondary"
              size="medium"
              onClick={() => Router.push("/add-post")}
              variant="contained"
            >
              Add Post
            </Button>
          </NavItem>
        </Nav>
      </Collapse>
      <style jsx>
        {`
          .add-post {
            color: black;
          }
          .add-post:hover {
            text-decoration: none;
          }
        `}
      </style>
    </Navbar>
  );
};

export default NavBar;
Navbar.propTypes = {
  light: PropTypes.bool,
  dark: PropTypes.bool,
  fixed: PropTypes.string,
  color: PropTypes.string,
  role: PropTypes.string,
  expand: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  // pass in custom element to use
};
NavbarBrand.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  // pass in custom element to use
};
