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
  Typography,
  Input,
} from "@material-ui/core";
import CheckedIcon from "@material-ui/icons/CheckOutlined";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes, { array } from "prop-types";
import Pagination from "@material-ui/lab/Pagination";

// import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles({
  formControl: { width: "80%", margin: ".5rem auto" },
});

//mock auth
const { uuid, userdept } = { uuid: 20, userdept: 5 };

const DisplayIssue = ({ id, selected, issue, dept }) => (
  <MenuItem value={id} className={selected ? "bg-red-500" : "bg-white"}>
    {" "}
    {/** Remove alt id suring prod */}
    {issue}
    {"  "}({dept})
  </MenuItem>
);

function DisplayIssues({
  issues = [],
  getIssue = (f) => f,
  issue = "",
  multiple = false,
}) {
  const [errorInt, setErrorInt] = React.useState(true);

  const classes = useStyles();
  const handleChange = (e) => {
    if (multiple) {
      if (!e.target.value.includes("")) {
        getIssue(e.target.value);
        setErrorInt(false);
      }
    } else {
      if (e.target.value) {
        getIssue(e.target.value);
        setErrorInt(false);
      }
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
        multiple={multiple}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Select Issue,</em>
        </MenuItem>
        {issues.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.selected ? <CheckedIcon htmlColor="green" /> : null}{" "}
            {/** Remove alt id suring prod */}
            {item.issue}
            {"  "}
            {multiple ? `(${item.dept})` : null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DisplayIssues;

export const ShowDepts = ({ depts = [], getDept = (f) => f }) => {
  const [current, setCurrent] = React.useState(0);
  const perpage = 10;
  const pages = Math.ceil(depts.length / perpage);
  const start = current * perpage;
  const end = current * perpage + perpage;
  const handleChange = (e, p) => setCurrent(p - 1);

  return (
    <>
      <Typography className="mx-auto text-center alert alert-info my-2">
        {depts.length} departments
      </Typography>
      <List>
        {depts.slice(start, end).map((dept, i) => (
          <ShowDept dept={dept} getDept={getDept} start={start + i + 1} />
        ))}
      </List>
      {depts.length > 10 ? (
        <Pagination
          count={pages}
          defaultValue={current + 1}
          color="primary"
          onChange={handleChange}
          className="my-2"
        />
      ) : null}
    </>
  );
};
const ShowDept = ({ dept = {}, getDept = (f) => f, start = 0 }) => (
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
    <small className="mr-2">{start}. </small>{" "}
    <ListItemText primary={dept.department} />
  </ListItem>
);

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

export function DisplayUsers({
  users = [],
  getUser = (f) => f,
  user = "",
  multiple = false,
}) {
  const [errorInt, setErrorInt] = React.useState(true);

  const classes = useStyles();
  const handleChange = (e) => {
    if (e.target.value) {
      getUser(e.target.value);

      setErrorInt(false);
    }
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="user-at-hand">Select Colleauge</InputLabel>
      <Select
        labelId="user-at-hand"
        id="issues-at-hand"
        value={user}
        variant="filled"
        error={errorInt}
        multiple={multiple}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Select Colleauge</em>
        </MenuItem>
        {users
          .filter((item) => +item.id !== uuid)
          .map((item) => (
            <MenuItem key={item.altId} value={item.id}>
              {item.username}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export const RangeInput = ({ users, currentRange, sendRange }) => {
  return (
    <FormControl>
      <InputLabel>view range</InputLabel>
      <Input
        type="number"
        min={10}
        max={Math.round(users.length)}
        value={currentRange}
        onChange={() => sendRange(e.taget.value)}
      />
    </FormControl>
  );
};

const MainPagination = (issues) => {
  const [current, setCurrent] = React.useState(0);
  const perpage = 10;
  const pages = Math.ceil(issues.length / perpage);
  const start = current * perpage;
  const end = current * perpage + perpage;
  const handleChange = (e, p) => setCurrent(p - 1);
  return (
    <Pagination
      count={pages}
      defaultValue={current + 1}
      color="primary"
      onChange={handleChange}
      className="my-2"
    />
  );
};
