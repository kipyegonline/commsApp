import React from "react";

import axios from "axios";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Button,
  FormHelperText,
  TextField,
  ListItemIcon,
  GridList,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Twitter, Facebook, Delete } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "../components/Layout";
import { ShowDepts } from "../components/posts/post";
import { AddDept } from "../components/users/addUsers";
import * as handleIssues from "../redux/Issues/actions";
import * as handleDepts from "../redux/departments/actions";
import FetchDepts from "../lib/api/depts";
import { getLocal, handleLocalStorage } from "../components/helpers";

const useclass = makeStyles({
  form: {
    padding: "1rem",
    margin: "1rem 0",
    maxWidth: 500,
    background: "#fff",
  },
});
// mock auth
const { uuid, userdept } = { uuid: 20, userdept: 5 };
function Issues() {
  const dispatch = useDispatch();
  const classes = useclass();

  const [loading, setloading] = React.useState(true);
  // redux
  const { issues: listIssues, departments, depterr, dept } = useSelector(
    (state) => ({
      issues: state?.issues.addedIssues,
      departments: state?.departments.departments,
      depterr: state?.departments.errorMsg,
      dept: state?.departments.dept,
    })
  );
  // fetch issues from server
  const fetchIssues = () => {
    axios
      .get("/issues/fetchall/true")
      .then((res) => {
        // dispatch issues to store
        dispatch(handleIssues.AddIssues(res.data));
        // issues relate to department
        dispatch(handleDepts.issueSelected(userdept));

        dispatch(handleIssues.getDeptIssues(userdept));
        dispatch(handleDepts.setDept(userdept));
      })
      .catch((error) => console.log(error, "fetch error"))
      .finally(() => setloading(false));
  };
  // add user issue to redux store
  const getValues = (issue) => {
    dispatch(handleIssues.addIssue(issue));
    // remove on prod
    // handleLocalStorage(issue, "issues");
  };
  // delete issue from redux
  const deleteValue = (id) => {
    // axios.get(`/issues?delete=${id}`);
    dispatch(handleIssues.deleteIssues(id));
  };
  React.useEffect(() => {
    fetchIssues();
    if (!departments.length) {
      FetchDepts("/departments/fetchdepts/true", dispatch);
    }
    // remove prod
    //dispatch(handleIssues.AddIssues(getLocal("issues")));
    return () => dispatch(handleDepts.resetSelected());
  }, []);

  const handleDept = (e) => {
    // set current department
    handleDepts.issueSelected(e);

    dispatch(handleDepts.issueSelected(e.id));
    dispatch(handleIssues.getDeptIssues(e.id));
  };
  const fetchAllfromStore = () => {
    dispatch(handleIssues.fetAll());
    dispatch(handleDepts.resetSelected());
  };
  return (
    <Layout>
      <Grid
        alignItems="flex-start"
        container
        justify="space-evenly"
        spacing={4}
        direction="row"
      >
        <Grid cols={5} item component="div" xs>
          <AddIssues sendValue={getValues} userdept={dept} />
        </Grid>
        <Grid item xs>
          {/* eslint-disable no-nested-ternary */}
          {departments.length ? (
            <ShowDepts depts={departments} getDept={handleDept} />
          ) : depterr ? (
            <div className="mx-auto my-4 text-center p-4">
              <Alert severity="error">
                <Typography align="center">{depterr}</Typography>
              </Alert>
            </div>
          ) : (
            <div className="mx-auto my-4 p-4 text-center">
              <CircularProgress color="primary" size="3rem" />
              <Typography>Loading departments</Typography>
            </div>
          )}
        </Grid>

        <Grid item xs>
          <Box className="block my-2">
            {/* eslint-disable no-nested-ternary */}
            {listIssues.length ? (
              <div>
                <Typography
                  variant="body2"
                  className="alert alert-primary text-center p-2 my-2"
                >
                  {dept.department || ""}
                </Typography>
                <IssueList issues={listIssues} deleteId={deleteValue} />
              </div>
            ) : loading ? (
              <div className="mx-auto my-4 text-center">
                <CircularProgress size="3rem" color="primary" />
              </div>
            ) : (
              <div className="mx-auto my-4 p-4 text-center">
                <Alert severity="error">
                  {" "}
                  <p>No issues found for this {dept.department}.</p>
                </Alert>{" "}
              </div>
            )}
            {departments.length ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={fetchAllfromStore}
              >
                View all issues
              </Button>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
}
const AddIssues = ({
  sendValue = (f) => f,
  userdept = {},
  sendSelected = (f) => f,
}) => {
  const [issue, setIssue] = React.useState("");
  const [errormsg, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const classes = useclass();
  const form = React.useRef(null);
  const btn = React.useRef(null);
  userdept = {
    id: 9,
    department: "Corporate Comms",
    altName: "PR.",
    alt_id: "fa79c125-7105-4915-b716-c1df86af5eca",
    selected: false,
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userdept.id) {
      setError("Please click on the department");
      setTimeout(() => setError(""), 3000);
    } else if (issue.trimRight().length < 5) {
      setError("Please type the issue");
      setTimeout(() => setError(""), 3000);
    } else if (issue.trimRight().length > 4 && userdept?.id) {
      btn.current.disabled = true;

      sendValue({ issue, altId: v4(), userdept: userdept.id });

      /* remove id during prod */

      // sendSelected("");
      axios
        .post("/issues/add/true", { issue, altId: v4(), userdept: userdept.id })
        .then((res) => {
          console.log(res);
          sendSelected("");
          if (res.status === 200) {
            setSuccess(res.msg);
            setIssue("");
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setTimeout(() => {
            form.current.reset();
            setSuccess("");
            btn.current.disabled = false;
          }, 3000);
        });
    }
  };
  return (
    <div>
      <form className={classes.form} ref={form} onSubmit={handleSubmit}>
        <p>Add issues for {userdept.altName || ""} department</p>
        <FormControl>
          <FormHelperText className="text-danger my-2">
            {userdept.altName || ""}{" "}
          </FormHelperText>
          <TextField
            label="Add issue(s)"
            autoFocus
            onChange={(e) => setIssue(e.target.value)}
            value={issue}
            variant="outlined"
          />
        </FormControl>

        <div className="form-group">
          <FormHelperText error className="my-1">
            {errormsg}
          </FormHelperText>
          <FormHelperText className="my-1 text-success">
            {success}
          </FormHelperText>
        </div>

        <Button
          color="secondary"
          type="submit"
          size="medium"
          variant="contained"
          ref={btn}
        >
          Add Issue
        </Button>
      </form>
    </div>
  );
};
const IssueList = ({ issues = [], deleteId = (f) => f }) => {
  const [current, setCurrent] = React.useState(0);
  const perpage = 10;
  const pages = Math.ceil(issues.length / perpage);
  const start = current * perpage;
  const end = current * perpage + perpage;
  const handleChange = (e, p) => setCurrent(p - 1);
  const deleteItem = (id) => {
    /* eslint-disable no-alert */
    if (confirm("Delete items?")) {
      deleteId(id);
      axios
        .get(`/issues/delete/${id}`)
        .then((res) => console.log(res))
        .then((res) => console.log(res))
        .catch((error) => error);
    }
  };

  return (
    <>
      <List dense>
        {issues.slice(start, end).map((issue, i) => (
          <ListItem key={issue.altId} divider alignItems="flex-start">
            <small>{start + i + 1}</small>
            <ListItemText primary={issue.issue} secondary={issue.altId} />
            <ListItemIcon>
              <Delete onClick={() => deleteItem(issue.altId)} />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      <Pagination
        count={pages}
        defaultValue={current + 1}
        color="primary"
        onChange={handleChange}
        className="my-2"
      />
    </>
  );
};
export default Issues;
// seen
