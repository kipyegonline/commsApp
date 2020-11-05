import React from "react";
import { Provider } from "react-redux";
import { Provider as NextAuthProvider } from "next-auth/client";
import PropTypes from "prop-types";
import { AppProps } from "next/app";

import "bootstrap/dist/css/bootstrap.min.css";
import "typeface-roboto";
import "typeface-raleway";
import store from "../redux/store";
import "../components/css/tailwind.css";
import ColorProvider from "../context/colors";

export default function MyApp({ Component, pageProps }) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <ColorProvider>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ColorProvider>
    </NextAuthProvider>
  );
}
MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};
