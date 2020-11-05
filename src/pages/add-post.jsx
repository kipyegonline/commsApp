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
  Card,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import AddCircle from "@material-ui/icons/AddCircle";
import { AddCircleOutlineRounded, DataUsageOutlined } from "@material-ui/icons";
import Layout from "../components/Layout";
import { InputGroup } from "reactstrap";
import DisplayIssues, { ShowDepts, ShowUsers } from "../components/posts/post";
import * as useractions from "../redux/usersReducer/actions";
import * as userdepts from "../redux/departments/actions";
import * as issueactions from "../redux/Issues/actions";
import { getLocal, handleLocalStorage } from "../components/helpers";

const useStyles = makeStyles({
  grid: { minWidth: 300 },
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
// mock auth
const { uuid, userdept } = { uuid: 20, userdept: 5 };

function AddPost() {
  const [clientName, setClientName] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientOrg, setClientOrg] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [issue, setIssue] = React.useState([]);
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
      issues: state.issues.fetched,
      selectedUsers: state.users.selectedUsers,
      departments: state.departments.departments,
    })
  );
  const dispatch = useDispatch();
  // set classes and date
  const classes = useStyles();
  const today = new Date();
  React.useEffect(() => {
    console.log("Effect, client Dept");
    window.addEventListener(
      "unload",
      () => {
        console.log("Dom unloading");
      },
      [clientDept]
    );
    window.addEventListener("load", () => {
      console.log("Dom loaded");
    });
  }, []);
  // fetch users from clicked department
  const fetchSelectedUsers = (id) => {
    fetch(`./server/users/users.php?fetchSelectedUsers=true&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          // add object property selected of false
          return data.map((user) => ({ ...user, selected: false }));
        }
        throw new Error("No payload");
      })
      // send to redux
      .then((data) => dispatch(useractions.addselectedUsers(data)))
      .catch((error) => console.log("fetch users error", error));
  };
  // fetch selected issues according to dept

  const fetchSelectedIssues = (id) => {
    fetch(`./server/issues/issues.php?fetchSelectedIssue=true&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const fetchedIssues = data.map((item) => ({
            ...item,
            selected: false,
          }));
          dispatch(issueactions.addFetched(fetchedIssues));
        }
        throw new Error("No payload");
      })
      .catch((error) => console.log("fetch issue error", error));
  };
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

    // fetch users from selected department or delete department and selected users
    if (selected) {
      dispatch(useractions.removeSelectedUsers(data.id));
      dispatch(issueactions.removeFetched(data.id));
      // remove users already handler array on component
      setHandler(handler.filter((handle) => handle.userdept !== data.id));
    } else {
      fetchSelectedUsers(data.id);
      fetchSelectedIssues(data.id);
    }
  };

  const handleIssue = (incomingIssue) => {
    // check if an issue being added or removed
    if (incomingIssue.length > issue.length) {
      // select added issue
      const theItem = incomingIssue[incomingIssue.length - 1];
      // confirm it exists on state
      const theIssue = issues.find((item) => item.id === theItem);

      if (theIssue) {
        // if it exists,check if there is similar issue selected as one can only select one issue per dept
        let exists = issues.some(
          (item) => item.userdept === theIssue.userdept && item.selected
        );
        if (!exists) {
          dispatch(issueactions.addSelected(theItem));
          // set state
          setIssue(incomingIssue);
        } else {
          alert(
            "Cannot select 2 issues from same department, split the post into 2"
          );
        }
      }
    } else {
      // here its a bit tricky.. check which item was removed by comparing array state and  incoming
      issue.forEach((item) => {
        if (incomingIssue.indexOf(item) < 0) {
          // remove item from redux
          dispatch(issueactions.removeSelected(item.id));
        }
      });
      // set the damn state
      setIssue(incomingIssue);
    }
  };

  let holder = [];
  const appendHandlerToIssue = (handler, issues) => {
    handler.forEach((item) => {
      const res = issues.find((d) => d.userdept === item.userdept);
      if (res) {
        let token = item.id + "-" + res.id;

        holder = [...holder, { ...item, id: token }];
      }
    });
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

      appendHandlerToIssue(handler, issues);

      const data = {
        clientName,
        clientPhone,
        clientEmail,
        clientOrg,
        message,
        handler: holder.map((user) => user.id).join("*"),
        subject,
        clientDept: clientDept.join("*"),
        addedBy: uuid,
        status: 0,
        altId: v4(),
        addedon: new Date().toLocaleString(),
      };
      console.log("dara", holder, data);
      //Remove on prod
      handleLocalStorage(data, "posts");
      $.ajax({
        url: "./server/posts/posts.php?addposts=true",
        dataType: "json",
        cache: false,
        type: "post",
        data,
      })
        .then((res) => {
          console.log("res", res);
          if (res.status === 200) {
            setSuccess(res.msg);

            // reset everything
            setTimeout(() => {
              dispatch(useractions.resetSelected([]));
              dispatch(userdepts.resetSelected([]));
              dispatch(issueactions.resetIssues([]));
              setSuccess();
              setClientName("");
              setClientPhone("");
              setClientEmail("");
              setClientOrg("");
              setMessage("");
              setIssue([]);
              setHandler([]);
              setSubject("");
              setClientDept([]);
              holder = [];
              form.current.reset();
              btn.current.disabled = false;
            }, 2000);
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
              {issues.length > 0 ? (
                <DisplayIssues
                  getIssue={handleIssue}
                  issue={issue}
                  issues={issues}
                  multiple
                />
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

              <Card>
                <small>Selected departments</small>
                <SelectedDepts depts={departments} />
              </Card>
            </Grid>
            <Grid item xs className={classes.grid}>
              {users.length > 0 ? (
                <ShowUsers users={users} getUser={handleUser} />
              ) : (
                <p className="text-center">Click on department to load users</p>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
}
export default AddPost;

const SelectedDepts = ({ depts }) =>
  depts
    .filter((dept) => dept.selected)
    .map((dept, i) => (
      <FormHelperText key={dept.id}>
        {i + 1}.{dept.altName}
      </FormHelperText>
    ));
