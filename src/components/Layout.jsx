import React from "react";
import Router from "next/router";
import Skeleton from "@material-ui/lab/Skeleton";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import { Grid, Typography } from "@material-ui/core";
import Head from "next/head";
import Header from "./Header";
import NavBar from "./Nav";
import Login from "../pages/login";

import ErrorBoundary, { ErrorScreen } from "../lib/api/Error";

const BreakThings = () => {
  throw new Error("We intentionally broke something");
};
const Layout = ({ children, title }) => {
  const data = useAuth();

  const layout = (
    <Container className="white lighten-1" fluid>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="title"
        />
      </Head>
      <Header />
      <NavBar />
      <section
        style={{
          minHeight: "100vh",
          paddingBottom: 100,
          marginTop: ".15rem",
        }}
      >
        {children}
      </section>
      <Footer />
      <style global jsx>
        {`
          html {
            box-sizing: border-box;
            background: #ccc;
            position: relative;
          }
          body {
            width: 100%;
            margin: 0 auto;
            padding: 0;
            line-height: 1.6em;
            font-family: roboto;
            font-size: 1.2rem;
            height: 100%;

            background: #fff;
          }
        `}
      </style>
      <style jsx>
        {`
          footer {
            background: blue;
            padding: 0.5rem;
          }
        `}
      </style>
    </Container>
  );
  if (globalThis.Window) {
    if (data)
      return <ErrorBoundary error={ErrorScreen}>{layout}</ErrorBoundary>;
    Router.push("/login");
  }

  return (
    <Skeleton width="100%" height="100%" variant="rect" animation="wave" />
  );
};
Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
export default Layout;
Layout.defaultProps = {
  title: "Mailtracker",
};
const Footer = () => (
  <Grid className="absolute bottom-0 left-0 bg-purple-800 mt-8 py-2 leading-snug text-white flex justify-center items-center w-full">
    <Typography align="center" variant="body1">
      Copyright &copy; {new Date().getFullYear()}
    </Typography>
  </Grid>
);

export const useAuth = () => {
  if (globalThis.Window) {
    const auth = JSON.parse(localStorage.getItem("commsApp"));
    if (auth) {
      let uuidArr = auth?.uuid.split("-");

      const uuid = Number(uuidArr[uuidArr.length - 1]);

      return { ...auth, uuid };
    }
  }
};

export const removeAuth = () => localStorage.removeItem("commsApp");
/*footer {
            width: 100%;
            height: 50px;
            border-top: 1px solid #eae;
            display: flex;
            position: absolute;
            left: 0;
            bottom: 0;
            justify-content: center;
            align-items: center;
            align-content: center;
          }
          footer p {
            padding: 0.5rem;
            line-height: 1.6em;
            text-align: center;
          } */
