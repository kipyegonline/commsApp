import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { v4 } from "uuid";
import FormHelperText from "@material-ui/core/FormHelperText";
import PropTypes from "prop-types";
import $ from "jquery";

const useStyles = makeStyles(
  createStyles({
    root: {
      display: "inline-flex",
      flexDirection: "row",
      margin: ".25rem .35rem ",
      border: "1px solid red",
    },
    formControl: {
      display: "flex",
    },
  })
);

function AddUser({ depts }) {
  const classes = useStyles();
  const form = React.useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form
      style={{
        margin: "1rem",
        padding: "1rem",
        borderRight: "2px solid gray",
      }}
      noValidate
      autoComplete="off"
      className="form"
      flex="column"
      spacing={2}
      onSubmit={handleSubmit}
      ref={form}
    >
      <p>Des form</p>
      <FormControl justify="center" className={classes.formControl}>
        <InputLabel>Name</InputLabel>
        <Input
          type="text"
          onChange={(e) => e}
          id="username"
          fullWidth
          placeholder=""
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel>Department</InputLabel>
        <Input
          type="text"
          onChange={(e) => e}
          id="userdept"
          placeholder=""
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Title</InputLabel>
        <Input
          type="text"
          onChange={(e) => e}
          id="usertitle"
          placeholder=""
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>

      <AddDept depts={depts} />
      <FormControl className={classes.root}>
        <InputLabel>Email</InputLabel>
        <Input
          type="text"
          onChange={(e) => e}
          id="useremail"
          placeholder=""
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>
      <FormControl className={classes.root}>
        <InputLabel>Phone</InputLabel>
        <Input
          type="text"
          onChange={(e) => e}
          id="userphone"
          placeholder=""
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>
      <Button
        variant="contained"
        size="medium"
        type="submit"
        color="primary"
        aria-label="move all right"
      >
        Add User
      </Button>
    </form>
  );
}
export default AddUser;

const AddDept = ({ depts }) => {
  const [dept, setdept] = React.useState("");
  const handleChange = (e) => {
    console.log(e.target.value);
    setdept(e.target.value);
  };
  return (
    <FormControl variant="filled">
      <InputLabel id="demo-simple-select-filled-label">Department</InputLabel>
      <Select
        labelId="user-department"
        id="user-department"
        value={dept}
        style={{ minWidth: 150, margin: 10 }}
        className="form-control my-3"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Department</em>
        </MenuItem>
        {depts.map((dep) => (
          <MenuItem key={dep.id} value={dep.id}>
            {dep.department}
          </MenuItem>
        ))}
       
      </Select>
    </FormControl>
  );
};


