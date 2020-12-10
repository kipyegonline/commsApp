import {
  Box,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  Typography,
  Button,
  FormHelperText,
  Snackbar,
} from "@material-ui/core";
import { v4 } from "uuid";
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert } from "reactstrap";

function ResetLink() {
  const [isValid, setValid] = React.useState(false);
  const [errmsg, setError] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confpassword, setconfPassword] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const form = React.useRef(null);
  const {
    query: { link },
  } = useRouter();

  const verifyLink = (q) => {
    axios
      .get(`/reset-link/${q}?q=verify`)
      .then((res) => {
        setValid(true);
        const { data } = res;
        if (data.status !== 200) {
          setError(data.msg);
        }
      })
      .catch((error) => {
        setValid(true);
        setError(error.message);
      })
      .finally(() => setTimeout(() => setError(""), 5000));
  };

  React.useEffect(() => {
    if (link) verifyLink(link);
  }, [link]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim().length) {
      setError("Kindly enter a password");
      setTimeout(() => setError(""), 3000);
    } else if (!confpassword.trim().length) {
      setError("Kindly confirm password");
      setTimeout(() => setError(""), 3000);
    } else if (password.trim() !== confpassword) {
      setError("Passwords do not match");
      setTimeout(() => setError(""), 3000);
    } else if (password.trim().length > 5 && confpassword.trim().length > 5) {
      setSpinner(true);
      axios
        .post("/update-password", { password, altId: link, uuid: v4() })
        .then((res) => {
          const { data } = res;
          if (data.status === 200) {
            setSuccess(data.msg);
          } else {
            throw new Error(data.msg);
          }
        })
        .catch((error) => setError(error.message))
        .finally(() => {
          setSpinner(false);
          setTimeout(() => {
            setSuccess("");
            setError("");
            setPassword("");
            setconfPassword("");
            form.current.reset();
          }, 3000);
        });
    } else {
      setError("Password must be atleast 6 characters long");
    }
  };
  const Holder = (
    <div className="p-4 my-4 text-center">
      <CircularProgress size="3rem" />
      <Typography>Verifying details</Typography>
    </div>
  );
  const ResetDetails = (
    <form className="p-4 sm:p-2" onSubmit={handleSubmit} ref={form}>
      <FormControl className="w-full my-3">
        <InputLabel>Enter password</InputLabel>
        <Input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
      </FormControl>

      <FormControl className="w-full my-3">
        <InputLabel>Confirm password</InputLabel>
        <Input
          type="password"
          nam="password_confirmation"
          onChange={(e) => setconfPassword(e.target.value)}
          fullWidth
        />
      </FormControl>
      <div className="my-2">
        <FormHelperText error>{errmsg}</FormHelperText>
      </div>
      <div className="p-2 my-2 text-center mx-auto">
        {spinner && <CircularProgress size="1.5rem" color="primary" />}
      </div>
      <Button
        type="submit"
        disabled={spinner}
        color="primary"
        variant="contained"
        className="block w-full"
      >
        Change password
      </Button>

      <Snackbar open={!!success}>
        <Alert severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>
    </form>
  );
  return (
    <Box
      className="mx-auto my-20 bg-gray-200 p-4 sm:mx-4 sm:my-0 sm:p-2"
      style={{ maxWidth: 400 }}
    >
      <Typography variant="h5" align="center">
        Change password
      </Typography>
      {isValid ? ResetDetails : Holder}
      <Typography className="text-center p-2">
        <Link href="/login">
          <a>Login</a>
        </Link>
      </Typography>
    </Box>
  );
}
export default ResetLink;
