import React from "react";
import axios from "axios";
import Link from "next/link";
import Layout from "../components/Layout";
import {
  Container,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  TextField,
  FormControl,
  Typography,
  FormHelperText,
} from "@material-ui/core";

function ResetPassword() {
  const [text, setText] = React.useState("");
  const [errormsg, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleReset = () => {
    if (!text) setError("Enter email to reset password");

    if (text.trim().length > 8 && text.includes("@")) {
      axios
        .post("/reset-password", { email: text })
        .then((res) => {
          const { data } = res;
          setSuccess(data.msg);
        })
        .catch((error) => setError(error.message));
    } else {
      setError("Enter a valid email address");
    }
    setTimeout(() => setError(""), 3000);
  };
  return (
    <Container maxWidth="xs" className="bg-gray-500 w-full p-4">
      <Card className="mt-20" style={{ maxWidth: 400 }}>
        <CardHeader
          title={<Typography align="center">Reset Password</Typography>}
        />
        <CardContent>
          <FormControl className="block my-3" style={{ width: "100%" }}>
            <TextField
              className="block"
              type="email"
              onChange={(e) => setText(e.target.value)}
              label="Enter your email address"
              variant="filled"
            />
          </FormControl>
          <FormHelperText className="p-2 text-center text-2xl" error>
            {errormsg}
          </FormHelperText>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            className="block  w-full"
            onClick={handleReset}
          >
            Submit
          </Button>

          <Typography align="center">
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
export default ResetPassword;
