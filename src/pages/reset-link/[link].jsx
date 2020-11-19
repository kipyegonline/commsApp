import {
  Box,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  Typography,
  Button,
  FormHelperText,
} from "@material-ui/core";
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

function ResetLink() {
  const [isValid, setValid] = React.useState(false);
  const [errmsg, setError] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);

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

  const Holder = (
    <div className="p-4 my-4 text-center">
      <CircularProgress size="3rem" />
      <Typography>Verifying details</Typography>
    </div>
  );
  const ResetDetails = (
    <form className="p-4 sm:p-2">
      <FormControl className="w-full my-3">
        <InputLabel>Enter password</InputLabel>
        <Input type="password" required fullWidth />
      </FormControl>

      <FormControl className="w-full my-3">
        <InputLabel>Confirm password</InputLabel>
        <Input type="password" required fullWidth />
      </FormControl>
      <Button
        type="submit"
        disabled={errmsg || spinner}
        color="primary"
        variant="contained"
        className="block w-full"
      >
        Change password
      </Button>
      <FormHelperText error>{errmsg}</FormHelperText>
    </form>
  );
  return (
    <Box
      className="mx-auto my-10 bg-gray-200 p-4 sm:mx-4 my-0 p-2"
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
