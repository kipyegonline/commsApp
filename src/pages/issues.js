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
} from "@material-ui/core";
import { Twitter, Facebook, Delete } from "@material-ui/icons";
import Layout from "../components/Layout";
import * as handleIssues from "../redux/Issues/actions";

const useclass = makeStyles({
  form: {
    padding: "1rem",
    margin: "1rem 0",
    maxWidth: 500,
    background: "#fff",
  },
});

function Issues() {
  const dispatch = useDispatch();
  const classes = useclass();
  // redux
  const { issues: listIssues } = useSelector((state) => ({
    issues: state.issues.issues,
  }));
  // fetch issues from server
  const fetchIssues = () => {
    axios
      .get("./server/issues/issues.php?fetchissues=true")
      .then((res) => dispatch(handleIssues.AddIssues(res.data)))
      .catch((error) => console.log(error, "fetch error"));
  };
  // add user issue
  const getValues = (issue) => dispatch(handleIssues.addIssue(issue));
  // delete issue
  const deleteValue = (id) => dispatch(handleIssues.deleteIssues(id));
  React.useState(() => {
    fetchIssues();
  });

  return (
    <Layout>
      <Grid
        alignItems="center"
        container
        justify="space-evenly"
        spacing={4}
        direction="row"
      >
        <Grid cols={5} item component="div">
          <AddIssues sendValue={getValues} />
        </Grid>
        <Grid item>
          <IssueList issues={listIssues} deleteId={deleteValue} />
        </Grid>
      </Grid>
    </Layout>
  );
}
const AddIssues = ({ sendValue }) => {
  const [issue, setIssue] = React.useState("");
  const [errormsg, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const classes = useclass();
  const form = React.useRef(null);
  const btn = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (issue.trimRight().length > 0) {
      btn.current.disabled = true;
      sendValue({ issue, altId: v4() });
      $.ajax({
        url: "./server/issues/issues.php?addissue=true",
        data: { issue, altId: v4() },
        type: "POST",
        dataType: "json",
      })
        .then((res) => {
          if (res.status === 200) {
            setSuccess(res.msg);
            setIssue("");
            setTimeout(() => {
              form.current.reset();
              setSuccess("");
              btn.current.disabled = false;
            }, 3000);
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
        <p>Add issues you would like to track in your organisation....</p>
        <FormControl>
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
    <List dense>
      {issues.map((issue, i) => (
        <ListItem key={issue.altId} divider alignItems="flex-start">
          {i + 1}
          <ListItemText primary={issue.issue} secondary={issue.altId} />
          <ListItemIcon>
            <Delete onClick={() => deleteItem(issue.altId)} />
          </ListItemIcon>
        </ListItem>
      ))}
    </List>
  );
};
export default Issues;
