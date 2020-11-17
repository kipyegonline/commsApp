import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  TextField,
  FormHelperText,
  Button,
} from "@material-ui/core";
import { AddCircleOutlineRounded } from "@material-ui/icons";
import DisplayIssues from "../posts/post";
import { useCustomerContext } from "../../pages/add-post";

function CustomerForm() {
  const {
    classes,
    issues,
    btn,
    success,
    errormsg,
    clientName,
    setClientPhone,
    setClientEmail,
    setClientOrg,
    handleIssue,
    setSubject,
    setMessage,
    issue,
  } = useCustomerContext();

  return (
    <>
      {/* item 1 */}
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="client-name">Enter Name</InputLabel>
        <Input
          type="text"
          {...clientName}
          id="client-name"
          variant="outlined"
        />
      </FormControl>
      {/* item 2 */}
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="client-phone">Enter Phone</InputLabel>
        <Input
          type="telephone"
          onChange={(e) => setClientPhone(e.target.value)}
          id="client-phone"
          variant="outlined"
          className={classes.input}
        />
      </FormControl>
      {/* item 3 */}
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="client">Enter email</InputLabel>
        <Input
          type="email"
          onChange={(e) => setClientEmail(e.target.value)}
          id="client-email"
          label="Enter email"
          className={classes.input}
          variant="outlined"
        />
      </FormControl>
      {/* item 3 */}
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="client">Enter Organisation</InputLabel>
        <Input
          type="text"
          onChange={(e) => setClientOrg(e.target.value)}
          id="client-org"
          label="Organisation"
          variant="outlined"
          className={classes.input}
        />
      </FormControl>
      {/* issues list */}
      {issues.length > 0 ? (
        <DisplayIssues getIssue={handleIssue} issue={issue} issues={issues} />
      ) : null}
      {/** item 4 */}

      <TextField
        label="subject"
        variant="outlined"
        onChange={(e) => setSubject(e.target.value)}
        fullWidth
        className={classes.textarea}
      />

      <TextField
        variant="outlined"
        label="Add Description"
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        size="medium"
        focused
        fullWidth
        multiline
        className={classes.textarea}
      />
      <FormHelperText className={errormsg ? "p -2 my-1 " : ""} error>
        {errormsg}
      </FormHelperText>
      <FormHelperText
        className={success ? "p -2 my-1 alert alert-success" : ""}
      >
        {success}
      </FormHelperText>
      {/* submit btn */}
      <Button
        color="primary"
        size="large"
        variant="filled"
        type="submit"
        ref={btn}
        startIcon={<AddCircleOutlineRounded />}
      >
        Post Issue
      </Button>
    </>
  );
}
export default CustomerForm;
