import React from "react";
import Router from "next/router";
import Skeleton from "@material-ui/lab/Skeleton";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import Head from "next/head";
import Header from "./Header";
import NavBar from "./Nav";
import Login from "../pages/login";
import { useAuth } from "../lib/api/users";

const Layout = ({ children, title }) => {
  const data = useAuth();
  React.useEffect(() => {
    if (!data) Router.push("/login");
  }, []);

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
      {data ? (
        children
      ) : (
        <Skeleton width={400} height={400} variant="rect" animation="wave" />
      )}
      <footer className="indigo text-white lighten-2 bg-primary p-2">
        <p>VINCE PRODUCTION</p>
      </footer>
      <style global jsx>
        {`
          html {
            box-sizing: border-box;
            background: #ccc;
          }
          body {
            width: 100%;
            margin: 0 auto;
            padding: 0;
            position: relative;
            line-height: 1em;
            font-family: helvetica;
            font-size: 1.2rem;

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
  return layout;
};
Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
export default Layout;
Layout.defaultProps = {
  title: "Mailtracker",
};
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
