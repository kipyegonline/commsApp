import React from "react";
import PropTypes from "prop-types";
import "materialize-css/dist/css/materialize.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
