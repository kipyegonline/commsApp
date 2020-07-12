import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes, { array } from "prop-types";
// import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles({
  formControl: { width: "80%", margin: ".5rem auto" },
});
function DisplayIssues({ issues = [], getIssue = (f) => f, issue = "" }) {
  const [errorInt, setErrorInt] = React.useState(true);
  const classes = useStyles();
  const handleChange = (e) => {
    if (e.target.value.length > 0) {
      getIssue(e.target.value);
      setErrorInt(false);
    }
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="issues-at-hand">Select Issue</InputLabel>
      <Select
        labelId="issues-at-hand"
        id="issues-at-hand"
        value={issue}
        variant="filled"
        error={errorInt}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Select Issue</em>
        </MenuItem>
        {issues.map((item) => (
          <MenuItem key={item.altId} value={item.altId}>
            {item.issue}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
export default DisplayIssues;

export const ShowDepts = ({ depts = [], getDept = (f) => f }) => {
  const [current, setCurrent] = React.useState(0);
  let perpage = 10;

  return (
    <List>
      {depts
        .slice(current * perpage, current * perpage + perpage)
        .map((dept, i) => (
          <ListItem
            key={dept.id}
            dense
            alignItems="center"
            selected
            className={dept.selected ? "bg-danger text-white" : "bg-light"}
            divider
            button
            onClick={() => getDept(dept)}
          >
            <small className="mr-2">{i + 1}. </small>{" "}
            <ListItemText primary={dept.department} />
          </ListItem>
        ))}
    </List>
  );
};

export const ShowUsers = ({ users = [], getUser = (f) => f }) => {
  return (
    <List dense>
      {users.map((user, i) => (
        <ListItem
          key={user.id}
          alignItems="center"
          divider
          button
          onClick={() => getUser(user)}
          className={user.selected ? "bg-info text-white" : "bg-light"}
          variant="contained"
          color="secondary"
        >
          <small className="mr-2">{i + 1}. </small>{" "}
          <ListItemText
            primary={user.username}
            secondary={user.usertitle + " - " + user.userphone}
          />
        </ListItem>
      ))}
    </List>
  );
};
ShowUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  getUser: PropTypes.func.isRequired,
};
