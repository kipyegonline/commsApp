import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import Layout from "../components/Layout";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function About() {
  const classes = useStyles();

  return (
    <Layout>
      <div className={classes.root}>
        <Badge badgeContent={4} color="primary">
          <MailIcon />
        </Badge>
        <Badge badgeContent={4} color="secondary">
          <MailIcon />
        </Badge>
        <Badge badgeContent={4} color="error">
          <MailIcon />
        </Badge>
      </div>
    </Layout>
  );
}
