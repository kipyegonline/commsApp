import Head from "next/head";
import React from "react";
import { Provider } from "react-redux";
import Link from "next/link";
import { Grid, Container, Divider } from "@material-ui/core";
import Layout from "../components/Layout";
import store from "../redux/store";

const Home = () => {
  const getInitialProps = () => {
    fetch("www.flickr.com/api")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };
  React.useEffect(() => {
    getInitialProps();
  }, []);
  return (
    <Layout title="Home">
      <Grid container justify="space-evenly" alignItems="flex-start">
        <Grid item>Users</Grid>
        <Divider orientation="vertical" />
        <Grid item>Departments</Grid>
        <Divider orientation="vertical" />
        <Grid item>Issues</Grid>
      </Grid>

      <style jsx>{``}</style>
    </Layout>
  );
};

export default Home;
