import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Skeleton from "@material-ui/lab/Skeleton";
import CircularProgress from "@material-ui/core/CircularProgress";
import MailIcon from "@material-ui/icons/Mail";
import Layout from "../components/Layout";

const useStyles1 = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function About() {
  const classes = useStyles1();

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
        <CircularProgress color="primary" />
        <Skeleton width={200} height={300} animation="wave" variant="rect" />
      </div>
    </Layout>
  );
}

const useStyles2 = makeStyles({
  root: {
    width: 300,
  },
});

export function Animations() {
  const classes = useStyles2();
  return (
    <div className={classes.root}>
      <Skeleton width={200} height={300} variant="rect" />
      <Skeleton animation={false} />
      <Skeleton animation="wave" />
    </div>
  );
}
