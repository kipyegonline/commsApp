import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import $ from "jquery";
import { v4 } from "uuid";
import {
  Grid,
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Input,
  Divider,
  FormHelperText,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import AddCircle from "@material-ui/icons/AddCircle";
import { AddCircleOutlineRounded, DataUsageOutlined } from "@material-ui/icons";
import Layout from "../components/Layout";
import { InputGroup } from "reactstrap";
import DisplayIssues, { ShowDepts, ShowUsers } from "../components/posts/post";
import * as useractions from "../redux/usersReducer/actions";
import * as userdepts from "../redux/departments/actions";

const useStyles = makeStyles({
  grid: { width: "100%" },
  root: {
    width: "90%",
    margin: ".5rem auto",
    border: "1px solid red",
    padding: "1rem",
  },
  textarea: {
    width: "80",
    margin: "1rem auto",
    borderRadius: 10,
  },
  formControl: {
    width: "100%",
  },
  input: {
    padding: "0.15rem",
    width: "100%",
    margin: "0.25rem 0.15rem",
  },
});

function AddPost() {
  const [clientName, setClientName] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientOrg, setClientOrg] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [issue, setIssue] = React.useState("");
  const [handler, setHandler] = React.useState([]);
  const [subject, setSubject] = React.useState("");
  const [clientDept, setClientDept] = React.useState([]);
  const [errormsg, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const form = React.useRef(null);
  const btn = React.useRef(null);

  // hit redux store

  const { issues, selectedUsers: users, departments } = useSelector(
    (state) => ({
      issues: state.issues.issues,
      selectedUsers: state.users.selectedUsers,
      departments: state.departments.departments,
    })
  );
  const dispatch = useDispatch();
  // set classes and date
  const classes = useStyles();
  const today = new Date();

  // handle  user actions
  const handleUser = (user) => {
    // check if users already clicked

    if (handler.find((item) => item.id === user.id)) {
      // if so,remove from list and redux
      const index = handler.findIndex((item) => item.id === user.id);
      handler.splice(index, 1);
      // send to redux store
      dispatch(useractions.editSelected(user.id));
    } else {
      // check if user from same department already added
      const userdeptexists = handler.some(
        (handle) => handle.userdept === user.userdept
      );

      if (userdeptexists) {
        alert("Cannot add 2 users from the same department");
      } else {
        // add to state and redux for ud
        setHandler([...handler, user]);
        // send to redux store
        dispatch(useractions.editSelected(user.id));
      }
    }
  };
  const handleDept = (data) => {
    if (clientDept.includes(data.id)) {
      clientDept.splice(clientDept.indexOf(data.id), 1);
    } else {
      const { id } = data;
      setClientDept([...clientDept, id]);
    }
    // send to redux store
    const { selected } = data;
    dispatch(userdepts.editSelected(data.id));
    // fetch users from selected department or delete
    selected
      ? dispatch(useractions.removeSelectedUsers(data.id))
      : fetchSelectedUsers(data.id);
  };

  const fetchSelectedUsers = (id) => {
    fetch(`./server/users/users.php?fetchSelectedUsers=true&id=${id}`)
      .then((res) => res.json())
      .then((data) => data.map((user) => ({ ...user, selected: false })))
      .then((data) => dispatch(useractions.addselectedUsers(data)))
      .catch((error) => console.log("fetch error", error));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (clientName.trim().length < 6) {
      setError("Kindly add a client or company name");
    } else if (issue.length < 1) {
      setError("Kindly select the nature of issue");
    } else if (subject.trim().length < 6) {
      setError("Kindly add the subject of the issue");
    } else if (message.trim().length < 10) {
      setError("Kindly provide a brief description of the issue");
    } else if (clientDept.length < 1) {
      setError("Please click on  the department to handle issue");
    } else if (handler.length < 1) {
      setError("Please click on the officer(s) to handle issue");
    } else if (
      clientName.trim().length > 5 &&
      issue.length > 0 &&
      subject.trim().length > 5 &&
      message.trim().length > 9 &&
      clientDept.length > 0 &&
      handler.length > 0
    ) {
      //send to server
      setError("");
      btn.current.disabled = true;
      const data = {
        clientName,
        clientPhone,
        clientEmail,
        clientOrg,
        message,
        issue,
        handler: handler.map((user) => user.id).join("*"),
        subject,
        clientDept: clientDept.join("*"),
        addedBy: 1,
        status: 0,
        altId: v4(),
        addedon: new Date().toLocaleString(),
      };
      console.log("dara", data);
      $.ajax({
        url: "./server/posts/posts.php?addposts=true",
        dataType: "json",
        cache: false,
        type: "post",
        data,
      })
        .then((res) => {
          console.log("res", res);
          if (res.status == 200) {
            setSuccess(res.msg);
            btn.current.disabled = false;

            // reset everything
            setTimeout(() => {
              dispatch(useractions.resetSelected([]));
              dispatch(userdepts.resetSelected([]));
              setSuccess();
              setClientName("");
              setClientPhone("");
              setClientEmail("");
              setClientOrg("");
              setMessage("");
              setIssue("");
              setHandler([]);
              setSubject("");
              setClientDept([]);
              form.current.reset();
            }, 5000);
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((error) => {
          btn.current.disabled = false;
          console.log("BBC", error, error.statusText, error.message);
        });
    } else {
      setError(
        "Kindly ensure name,type of issue,subject,message,department and officer in-charge fields are not empty"
      );
    }
  };

  return (
    <Layout>
      <Box className={classes.root}>
        <form className="form" ref={form} onSubmit={handleSubmit}>
          <h5 className="text-center alert alert-info p-2 my-2">
            Add new issue - {today.toDateString()}
          </h5>
          <Grid container justify="space-evenly" alignItems="flex-start">
            <Grid
              item
              xs
              className={`my-3 p-2 card w-100 ${classes.grid}`}
              style={{ border: "1px solid yellow" }}
            >
              <p className="text-center">Customer details</p>
              {/* item 1 */}
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="client-name">Enter Name</InputLabel>
                <Input
                  type="text"
                  onChange={(e) => setClientName(e.target.value)}
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
              <DisplayIssues
                getIssue={setIssue}
                issue={issue}
                issues={issues}
              />
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
              <FormHelperText error>{errormsg}</FormHelperText>
              <FormHelperText className="alert alert-success">
                {success}
              </FormHelperText>
              {/* submit btn */}
              <Button
                color="primary"
                size="large"
                variant="outlined"
                type="submit"
                ref={btn}
                startIcon={<AddCircleOutlineRounded />}
              >
                Post Issue
              </Button>
            </Grid>
            <Grid item xs className={classes.grid}>
              <ShowDepts depts={departments} getDept={handleDept} />
            </Grid>
            <Grid item xs className={classes.grid}>
              {users.length > 0 ? (
                <ShowUsers users={users} getUser={handleUser} />
              ) : (
                <p className="text-center">Click on department to load users</p>
              )}
            </Grid>
          </Grid>

          <Box></Box>
        </form>
      </Box>
    </Layout>
  );
}
export default AddPost;
