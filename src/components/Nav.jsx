import React, { useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core";
import {
  Fab,
  IconButton,
  AppBar,
  Toolbar,
  Link as MLink,
  MenuItem,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Close from "@material-ui/icons/Close";
import Home from "@material-ui/icons/Home";
import Users from "@material-ui/icons/SupervisedUserCircleSharp";
import Post from "@material-ui/icons/PostAdd";
import PostsIcons from "@material-ui/icons/List";
import Issues from "@material-ui/icons/Info";
import Departments from "@material-ui/icons/BusinessCenter";
import Exit from "@material-ui/icons/ExitToApp";

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
import { removeAuth, useAuth } from "./Layout";

const useStyles = makeStyles({
  nav: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: ".5rem",

    margin: 0,
    "@media (max-width:480px)": {
      flexDirection: "column",
      width: "100%",
      alignItems: "center",

      transition: "all .25s linear",
    },
  },
  navlink: {
    cursor: "pointer",

    display: "block",
  },
  active: {
    borderBottom: "2px solid red",
  },
  menuButton: {
    width: "100%",
    outline: "none",
    display: "none",
    "@media (max-width:480px)": {
      display: "block",
    },
  },
});

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteError = () => NProgress.done();

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(useAuth());
  const classes = useStyles();
  const { pathname } = useRouter();
  const [isMobile, setMobile] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    removeAuth();

    //location.reload();
    Router.push("/login");
  };

  return (
    <AppBar color="transparent" position="static">
      <div>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="open drawer"
          size="medium"
          onClick={toggle}
          className={classes.menuButton}
        >
          {isOpen ? <Close /> : <MenuIcon />}
        </IconButton>
      </div>

      <div className={classes.nav}>
        <Typography color="secondary" variant="subtitle1">
          {user.username}
        </Typography>

        <Typography
          variant="body2"
          className={pathname === "/" ? classes.active : ""}
        >
          <Link href="/">
            <a>
              {" "}
              <IconButton>
                <Home />
              </IconButton>
            </a>
          </Link>
        </Typography>

        <Typography
          className={pathname === "/posts" ? classes.active : ""}
          variant="body2"
        >
          <Link href="/posts">
            <a>
              <IconButton>
                <PostsIcons />
              </IconButton>
              Posts
            </a>
          </Link>
        </Typography>
        <Typography
          variant="body2"
          className={pathname === "/users" ? classes.active : ""}
        >
          <Link href="/users">
            <a>
              {" "}
              <IconButton>
                <Users />
              </IconButton>
              Users
            </a>
          </Link>
        </Typography>
        <Typography
          variant="body2"
          className={pathname === "/add-departments" ? classes.active : ""}
        >
          <Link href="/add-departments">
            <a>
              <IconButton>
                <Departments />
              </IconButton>
              Departments
            </a>
          </Link>
        </Typography>
        <Typography
          variant="body2"
          className={pathname === "/issues" ? classes.active : ""}
        >
          <Link href="/issues">
            <a>
              <IconButton>
                <Issues />
              </IconButton>
              Issues
            </a>
          </Link>
        </Typography>

        <div>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={() => Router.push("/add-post")}
          >
            post Issue
          </Button>
        </div>
        <Typography variant="subtitle1">
          <IconButton color="secondary" size="small" onClick={handleLogout}>
            <Exit />
            log out
          </IconButton>
        </Typography>
      </div>
    </AppBar>
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

const MobileMenu = () => (
  <div className={classes.navbarMobileTop}>
    <div>
      <IconButton
        edge="end"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"
        size="medium"
        onClick={handleMenuIcon}
      >
        {isOpen ? <Close /> : <MenuIcon />}
      </IconButton>
    </div>
    {isOpen ? (
      <div className={classes.nav}>
        <Typography className={pathname === "/" ? classes.active : ""}>
          <Link href="/">
            <NavLink className={classes.navlink}>
              <IconButton>
                <Home />
              </IconButton>
            </NavLink>
          </Link>
        </Typography>

        <Typography
          className={pathname === "/posts" ? classes.active : ""}
          variant="body2"
        >
          <Link href="/posts">
            <NavLink className={classes.navlink}>
              <IconButton>
                <PostsIcons />
              </IconButton>
              Posts
            </NavLink>
          </Link>
        </Typography>
        <Typography className={pathname === "/users" ? classes.active : ""}>
          <Link href="/users">
            <NavLink className={classes.navlink}>
              <IconButton>
                <Users />
              </IconButton>
              Users
            </NavLink>
          </Link>
        </Typography>
        <Typography
          className={pathname === "/add-departments" ? classes.active : ""}
        >
          <Link href="/add-departments">
            <NavLink className={classes.navlink}>
              <IconButton>
                <Departments />
              </IconButton>
              Departments
            </NavLink>
          </Link>
        </Typography>
        <Typography className={pathname === "/issues" ? classes.active : ""}>
          <Link href="/issues">
            <NavLink className={classes.navlink}>
              <IconButton>
                <Issues />
              </IconButton>
              Issuessssss
            </NavLink>
          </Link>
        </Typography>

        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={() => Router.push("/add-post")}
          >
            Create
          </Button>
        </div>
        <Typography variant="title">
          <Link href="/issues">
            <NavLink className={classes.navlink}>
              <IconButton color="secondary" onClick={handleLogout}>
                <Exit />
              </IconButton>
              logg out
            </NavLink>
          </Link>
        </Typography>
      </div>
    ) : null}
  </div>
);
