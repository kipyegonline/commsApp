import React from "react";
import $ from "jquery";
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
  Box,
} from "@material-ui/core";
import { Twitter, Facebook, Delete } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import Layout from "../components/Layout";
import { ShowDepts } from "../components/posts/post";
import { AddDept } from "../components/users/addUsers";
import * as handleIssues from "../redux/Issues/actions";
import * as handleDepts from "../redux/departments/actions";
import { getLocal, handleLocalStorage } from "../components/helpers";

const useclass = makeStyles({
  form: {
    padding: "1rem",
    margin: "1rem 0",
    maxWidth: 500,
    background: "#fff",
  },
});
//mock auth
const { uuid, userdept } = { uuid: 20, userdept: 5 };
function Issues() {
  const dispatch = useDispatch();
  const classes = useclass();
  const [dept, setDept] = React.useState({});
  // redux
  const { issues: listIssues, departments } = useSelector((state) => ({
    issues: state.issues.addedIssues,
    departments: state.departments.departments,
  }));
  // fetch issues from server
  const fetchIssues = () => {
    axios
      .get("./server/issues/issues.php?fetchissues=true")
      .then((res) => dispatch(handleIssues.AddIssues(res.data)))
      .catch((error) => console.log(error, "fetch error"));
  };
  // add user issue
  const getValues = (issue) => {
    dispatch(handleIssues.addIssue(issue));
    //remove on prod
    handleLocalStorage(issue, "issues");
  };
  // delete issue
  const deleteValue = (id) => {
    axios.get(`./server/issues/issues.php?deleteIssue=true&id=${id}`);
    dispatch(handleIssues.deleteIssues(id));
  };
  React.useEffect(() => {
    fetchIssues();
    dispatch(handleDepts.issueSelected(userdept));
    dispatch(handleIssues.getDeptIssues(userdept));

    //remove prod
    // dispatch(handleIssues.AddIssues(getLocal("issues")));
  }, []);

  const handleDept = (e) => {
    setDept(e);

    dispatch(handleDepts.issueSelected(e.id));
    dispatch(handleIssues.getDeptIssues(e.id));
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
          <ShowDepts depts={departments} getDept={handleDept} />
        </Grid>

        <Grid item xs>
          <Box>
            <small className="alert alert-primary text-center p-2 my-2">
              {dept.department || ""}
            </small>
            <IssueList issues={listIssues} deleteId={deleteValue} />
            {departments.length ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => dispatch(handleIssues.fetAll())}
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userdept.id) {
      setError("Please click on the department");
      setTimeout(() => setError(""), 3000);
    } else if (issue.trimRight().length < 5) {
      setError("Please type the issue");
      setTimeout(() => setError(""), 3000);
    } else if (issue.trimRight().length > 4 && userdept.id.length > 0) {
      btn.current.disabled = true;
      sendValue({ issue, altId: v4(), userdept: userdept.id });

      /* remove id during prod */

      // sendSelected("");
      $.ajax({
        url: "./server/issues/issues.php?addissue=true",
        data: { issue, altId: v4(), userdept: userdept.id },
        type: "POST",
        dataType: "json",
      })
        .then((res) => {
          sendSelected("");
          if (res.status === 200) {
            setSuccess(res.msg);
            setIssue("");
            setTimeout(() => {
              form.current.reset();
              setSuccess("");
              btn.current.disabled = false;
            }, 2000);
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((error) => {
          btn.current.disabled = false;
          setError(error.message);
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
      fetch(`./server/issues/issues.php?deleteissue=true&id=${id}`)
        .then((res) => res.json())
        .then((res) => res)
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
