import React from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap.min.css";
import "typeface-roboto";
import "typeface-raleway";
import store from "../redux/store";
import "../components/css/tailwind.css";

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
