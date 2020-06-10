import React from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import Head from "next/head";
import Header from "./Header";
import NavBar from "./Nav";

const Layout = ({ children, title }) => {
  return (
    <Container className="red lighten-1" fluid>
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
      {children}
      <footer className="indigo lighten-2 bg-primary p-2">
        <p>VINCE PRODUCTION</p>
      </footer>
      <style global jsx>
        {`
          html {
            box-sizing: border-box;
          }
          body {
            width: 90%;
            margin: 0.25rem auto 0;
            padding: 1.2rem;
            line-height: 1em;
            font-family: helvetica;
            font-size: 1.2rem;
          }
        `}
      </style>
      <style jsx>
        {`
          footer {
            width: 100%;
            height: 50px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: flex-end;
          }
        `}
      </style>
    </Container>
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
