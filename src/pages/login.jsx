import React from "react";
import axios from "axios";
import Router from "next/router";
import Head from "next/head";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  Card,
  Input,
  InputLabel,
  FormControl,
  Typography,
  CardActions,
  CardContent,
  Button,
  Snackbar,
  LinearProgress,
  Divider,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useAuth } from "../lib/api/users";

const useStyles = makeStyles({
  card: {
    maxWidth: 500,
    margin: "3rem auto",
    padding: "1.3rem",
  },
  logincontainer: {
    background: "#ccc",
    padding: "1rem",
    width: "100%",
    height: "100vh",
  },
  input: {
    width: "80%",
    display: "block",
    margin: ".5rem auto",
  },
  btn: {
    width: "80%",
    display: "block",
    margin: ".5rem auto",
  },
});

function Login() {
  // initialize state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);
  const [emailerr, setEmailerr] = React.useState("");
  const [perr, setPerr] = React.useState("");
  const [errmsg, setError] = React.useState("");
  const classes = useStyles();

  React.useEffect(() => {
    // check if user is logged in,if so,  send them to home page
    let timer = setTimeout(() => {
      const data = useAuth();
      console.log("pushinh");
      if (data) Router.push("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const handleChange = (e) => {
    // get input and set state
    const setState = eval("set" + e.target.name);
    setState(e.target.value);
  };

  const handleBlur = (e) => {
    if (e.target.name === "Email") {
      if (e.target.value.length) setEmailerr("");
    }

    if (e.target.name === "Password") {
      if (e.target.value.length > 5) setPerr("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate the damn data
    if (!email.trim() && !password.trim()) {
      setEmailerr(" is required.");
      setPerr(" is required");
    } else if (email.trim().length < 6) {
      email.length < 1
        ? setEmailerr("is required")
        : setEmailerr(" is invalid");
    } else if (password.trim().length < 6) {
      password.length < 1
        ? setPerr("is required")
        : setPerr(" must have atleast 6 characters.");
    } else if (email.trim().length > 5 && password.trim().length > 5) {
      // if it looks good,remove error messages and  send to the server,
      setPerr("");
      setEmailerr("");
      setSpinner(true);
      // send to server
      axios
        .post("./server/users/user.php?loginuser=true", { email, password })
        .then((res) => {
          console.log(res);
          const { data } = res;

          setSpinner(false);
          if (data.status === 200) {
            setPassword("");
            setEmail("");
            // store the return token on local storage  and route to home page
            // global this is an addition to ES2020
            globalThis &&
              localStorage.setItem("commsApp", JSON.stringify(data));
            Router.push("/");
          } else {
            throw new Error(data.statusText);
          }
        })
        .catch((error) => {
          // any login error are show here
          setError(error.message);
          setSpinner(false);
          setTimeout(() => setError(""), 5000);
        });
    } else {
      // unknown unknown errors
      setError("Error logging in...Check network and try again....");
      setTimeout(() => setError(""), 3000);
    }
  };
  return (
    <Grid className={classes.logincontainer}>
      <Head>
        <title>Login | Comms App </title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="title"
        />
      </Head>

      <Card className={classes.card} elevation={10}>
        <Typography variant="h5" align="center">
          Customer care manager Portal
        </Typography>
        <Divider />
        <form onSubmit={handleSubmit}>
          <CardContent style={{ maxWidth: 500 }}>
            <FormControl className={classes.input}>
              <InputLabel error={!!emailerr.length}>
                Email {emailerr}
              </InputLabel>
              <Input
                type="email"
                name="Email"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl className={classes.input}>
              <InputLabel error={!!perr.length}>Password {perr}</InputLabel>
              <Input
                type="password"
                fullWidth
                name="Password"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              className={classes.input}
              color="primary"
              type="submit"
              disabled={spinner}
            >
              Log in
            </Button>
          </CardActions>
          {spinner ? <LinearProgress /> : null}
          <Snackbar
            open={!!errmsg.length}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert severity="error">{errmsg}</Alert>
          </Snackbar>
        </form>
      </Card>
      <style jsx>{`
        .login {
          max-width: 500px;
          margin: auto;
          padding: 1rem;
          background: red;
        }
        .login-container {
          background: #ccc;
          padding: 1rem;
          margin: 3rem auto;
          border: 1px solid red;
        }
      `}</style>
    </Grid>
  );
}
export default Login;
