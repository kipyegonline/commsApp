import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Layout from "../components/Layout";

const MyTypography = ({ variant, ...props }) => (
  <Typography variant={variant || "inherit"} {...props} />
);
const TypesOfTypography = () => (
  <Layout>
    <Typography variant="h1" color="secondary">
      h1 variant
    </Typography>
    <Typography variant="h2" color="secondary">
      h2 variant
    </Typography>
    <Typography variant="h3" color="secondary">
      h3 variant
    </Typography>
    <Typography variant="h4" color="secondary">
      h4 variant
    </Typography>
    <Typography variant="h5" color="secondary">
      h5 variant
    </Typography>
    <Typography variant="h6">h6 variant</Typography>
    <Typography variant="subtitle1" color="primary">
      subtitle1 variant
    </Typography>
    <Typography variant="subtitle2" color="textPrimary">
      subtitle2 variant
    </Typography>
    <Typography variant="body1" color="textPrimary">
      body1 variant
    </Typography>
    <Typography variant="body2">body2 variant</Typography>
    <Typography variant="subtitle1">subtitle1 variant</Typography>
    <Typography variant="caption">caption variant</Typography>
    <Typography variant="button">button variant</Typography>
    <Typography variant="overline">overline variant</Typography>
    <Typography variant="title" component="div">
      <Typography variant="inherit">inherited title variant</Typography>
      <Typography variant="inherit">another inherited title variant</Typography>
      <Typography variant="caption">overridden caption variant</Typography>
    </Typography>
    <MyTypography variant="title" component="div">
      <MyTypography>inherited title variant</MyTypography>
      <MyTypography>another inherited title variant</MyTypography>
      <MyTypography variant="caption">overridden caption variant</MyTypography>
    </MyTypography>
  </Layout>
);

export default TypesOfTypography;
