import React from "react";
import PropTypes from "prop-types";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import { Typography, CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { Close, CloseRounded } from "@material-ui/icons";
import axios from "axios";
import { Grid } from "@material-ui/core";
import { v4 } from "uuid";
import FormHelperText from "@material-ui/core/FormHelperText";

import { getLocal, handleLocalStorage, editLocal } from "../helpers";
import { FormText } from "reactstrap";

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
      flexDirection: "row",
      margin: ".5rem",
      width: "100%",
      "&:input": {
        width: "100%",
      },
    },
    input: {
      width: "90%",
    },
  })
);

function AddUser({
  depts = [],
  title = "",
  url = "",
  Edit = {},
  updateData = (f) => f,
  closeEditor = (f) => f,
  isEditing = false,
  setEdit = (f) => f,
}) {
  const [username, setUsername] = React.useState("");
  const [usertitle, setUserTitle] = React.useState("");
  const [useremail, setUserEmail] = React.useState("");
  const [userphone, setUserPhone] = React.useState("");
  const [userdept, setuserDept] = React.useState("");
  const [userpassword, setUserpassword] = React.useState("");
  const [successmsg, setSuccess] = React.useState("");
  const [errormsg, setError] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const [spinner, setSpin] = React.useState(false);
  const form = React.useRef(null);
  const btn = React.useRef(null);
  const classes = useStyles();

  const sendValue = (e) => {
    const setFunc = eval(e.target.id);
    if (setFunc === undefined) {
      return setuserDept(e.target.value);
    }

    setFunc(e.target.value);
  };

  const handleEditor = () => {
    closeEditor(false);
    setEditing(false);
    setUsername("");
    setUserPhone("");
    setUserTitle("");
    setUserEmail("");
    setUserpassword("");
    setuserDept("");
    setError("");
    setEdit({});
  };
  React.useEffect(() => {
    if (Edit.id !== undefined) {
      setEditing(true);
      setUsername(Edit.username);
      setUserPhone(Edit.userphone);
      setUserTitle(Edit.usertitle);
      setUserEmail(Edit.useremail);
      setUserpassword("littlefireseverywhere"); // no need to edit password but we need to pass the validation
      setuserDept(Edit.userdept);
    }
  }, [Edit]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim().length < 5 || username.indexOf(" ") < 0) {
      username.trim().length < 5
        ? setError("Kindly add  a name")
        : setError("Enter second name");
    } else if (usertitle.trim().length < 2) {
      setError("Enter job title");
    } else if (userphone.trim().length === 0 || userphone.trim().length < 9) {
      userphone.trim().length === 0
        ? setError("Enter users phone number")
        : setError("Check the phone number");
    } else if (userdept < 1) {
      setError("Choose Department");
    } else if (useremail.trim().length < 6) {
      setError("Please enter an email address");
    } else if (
      userpassword.trim().length === 0 ||
      userpassword.trim().length < 6
    ) {
      userpassword.trim().length === 0
        ? setError("Kindly enter a default  password")
        : setError("The userpassword should be atleast 6 characters long");
    } else if (
      username.trim().length > 6 &&
      userphone.trim().length > 6 &&
      usertitle.trim().length > 0 &&
      useremail.trim().length > 6 &&
      userdept.length > 0 &&
      userpassword.trim().length > 5
    ) {
      // disable button
      btn.current.disabled = true;
      setSpin(true);

      // send to server
      /*
      // remove  this lines on on prod
      if (!editing) {
        let uuid = v4();
        handleLocalStorage(
          {
            username,
            userphone,
            usertitle,
            useremail,
            userdept,
            userpassword,
            altId: uuid,
          },
          "users"
        );
      } else {
        const editedData = {
          username,
          userphone,
          usertitle,
          useremail,
          userdept,
          userpassword,
          altId: Edit.altId,
        };
        editLocal(Edit, editedData, "users");

        setEditing(false);
      }

      //dev env end
*/
      setError("");
      //if  adding new user
      let data = {
        username: username.trim(),
        userphone: userphone.trim(),
        usertitle: usertitle.trim(),
        useremail: useremail.trim(),
        userdept,
        userpassword: userpassword.trim(),
        userAltId: v4(),
      };
      //check if user is editing or adding new user, set up data or spread existing data

      editing
        ? (data = {
            ...Edit,
            username: username.trim(),
            userphone: userphone.trim(),
            usertitle: usertitle.trim(),
            useremail: useremail.trim(),
            userdept,
            userpassword: userpassword.trim(),
          })
        : data;

      // also update redux state if we're editing
      editing && updateData(data, true);
      // then send to server via jquery ajax, url sent via props

      axios
        .post(url, {
          ...data,
        })

        .then((res) => {
          // immediately fetch added user from server
          console.log("user added or edited", editing, res);
          editing === false ? updateData({}, false) : null;

          if (res.data.status === 200) {
            setSuccess(res.data.msg);
            btn.current.disabled = false;
            setSpin(false);
            form.current.reset();
            setTimeout(() => {
              setSuccess("");

              setUsername("");
              setUserPhone("");
              setUserTitle();
              setUserEmail("");
              setUserpassword("");
              setuserDept("");

              // editor
              if (editing) {
                setEditing(false);
                closeEditor(false);
                setEdit({});
              }
            }, 2000);
          } else {
            throw new Error(res.data.msg);
          }
        })
        .catch((error) => {
          setSpin(false);
          setError(error.message);
          console.log("err", error);
          btn.current.disabled = false;
          setTimeout(() => setError(""), 3000);
        });
    } else {
      setError("Something is wrong. Check all fields and try again later");
    }
  };
  return (
    <form
      style={{
        margin: ".5rem auto",
        padding: "1rem",
        border: "1px solid red",
        boxShadow: "-2px -2px 5px red, 2px 2px 5px red",
      }}
      noValidate
      autoComplete="off"
      className="form w-100"
      flex="column"
      spacing={0}
      onSubmit={handleSubmit}
      ref={form}
    >
      {/*close icons for edit form */}
      {editing ? (
        <CloseRounded
          className="float-right"
          color="secondary"
          onClick={handleEditor}
        />
      ) : null}
      <p className="text-center">{editing ? "Edit User" : "Add User"}</p>
      <FormControl justify="center" className={classes.formControl}>
        <InputLabel>Name</InputLabel>
        <Input
          type="text"
          onChange={(e) => sendValue(e)}
          id="setUsername"
          className={classes.input}
          placeholder=""
          inputProps={{ "aria-label": "description" }}
          value={username}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Title</InputLabel>
        <Input
          type="text"
          onChange={(e) => sendValue(e)}
          id="setUserTitle"
          className={classes.input}
          placeholder=""
          inputProps={{ "aria-label": "description" }}
          value={usertitle}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Phone</InputLabel>
        <Input
          type="text"
          onChange={(e) => sendValue(e)}
          id="setUserPhone"
          className={classes.input}
          placeholder=""
          inputProps={{ "aria-label": "description" }}
          value={userphone}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        {" "}
        <FormText>{Edit.department || ""}</FormText>
        <AddDept depts={depts} userdept={userdept} sendValue={sendValue} />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Email</InputLabel>
        <Input
          type="email"
          className={classes.input}
          onChange={(e) => sendValue(e)}
          id="setUserEmail"
          placeholder=""
          value={useremail}
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>
      {!editing ? (
        <FormControl className={classes.formControl}>
          <InputLabel>Password</InputLabel>
          <Input
            type="password"
            className={classes.input}
            onChange={(e) => sendValue(e)}
            id="setUserpassword"
            value={userpassword}
            placeholder=""
            inputProps={{ "aria-label": "description" }}
          />
        </FormControl>
      ) : null}
      <div className="form-group">
        <FormHelperText className="text-danger">{errormsg}</FormHelperText>
      </div>
      {spinner ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : null}
      <SimpleSnackbar show={!!successmsg} message={successmsg} />
      <Button
        variant="contained"
        size="medium"
        type="submit"
        color="primary"
        ref={btn}
        className="btn btn-block mt-3"
        aria-label="move all right"
      >
        {editing ? "Edit User" : "Add User"}
      </Button>
    </form>
  );
}
AddUser.propTypes = {
  depts: PropTypes.arrayOf(
    PropTypes.shape({
      department: PropTypes.string,
      altName: PropTypes.string,
      altId: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string,
  url: PropTypes.string,
  Edit: PropTypes.shape({
    department: PropTypes.string,
    altName: PropTypes.string,
    altId: PropTypes.string,
    id: PropTypes.string,
  }),
};
export default AddUser;

export const AddDept = ({
  depts = [],
  sendValue = (f) => f,
  userdept = "",
  department = "",
}) => {
  const [dept, setdept] = React.useState(userdept);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setdept(userdept);
  }, [userdept]);

  const handleChange = (e) => {
    //setdept(e.target.value);
    sendValue(e, dispatch);
  };
  return (
    <FormControl variant="filled">
      <InputLabel id="demo-simple-select-filled-label">Department</InputLabel>
      <Select
        labelId="user-department"
        id="demo-simple-select-filled-label"
        value={dept}
        style={{ minWidth: 200, margin: 10 }}
        className=" my-3"
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
      <Typography className="my-1 p-1" variant="subtitle2">
        {department || ""}
      </Typography>
    </FormControl>
  );
};
AddDept.propTypes = {
  depts: PropTypes.arrayOf(
    PropTypes.shape({
      department: PropTypes.string,
      altName: PropTypes.string,
      altId: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  sendValue: PropTypes.func.isRequired,
  userdept: PropTypes.string,
  department: PropTypes.string,
};

export const SearchUser = ({ getSearch = (f) => f }) => {
  const [text, setText] = React.useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      getSearch(text, dispatch);
      setText("");
    }
  };

  return (
    <form className="form form-inline p-2 " onSubmit={handleSubmit}>
      <FormControl className="my-2 ">
        <InputLabel>Search User</InputLabel>
        <Input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <Search
                size="large"
                style={{ cursor: "pointer" }}
                onClick={handleSubmit}
              />
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  );
};

export function SimpleSnackbar({ show, message }) {
  const [open, setOpen] = React.useState(show);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
    >
      <Alert onClose={handleClose} severity="success">
        {message}
      </Alert>
    </Snackbar>
  );
}

function Alert(props) {
  return (
    <MuiAlert
      style={{ width: "100%" }}
      elevation={6}
      variant="filled"
      {...props}
    />
  );
}

/* action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={handleClose}>
            Close
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }*/
