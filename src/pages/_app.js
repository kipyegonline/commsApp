import React from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
//import "materialize-css/dist/css/materialize.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "../redux/store";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
