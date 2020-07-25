import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Close, CloseRounded } from "@material-ui/icons";
import $ from "jquery";
import { Grid } from "@material-ui/core";
import { v4 } from "uuid";
import FormHelperText from "@material-ui/core/FormHelperText";
import PropTypes from "prop-types";
import {
  getLocal,
  handleLocalStorage,
  editLocal,
} from "../../components/helpers";
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
  };
  React.useEffect(() => {
    console.log("changes up");

    if (Edit["id"] !== undefined) {
      setEditing(true);
      setUsername(Edit.username);
      setUserPhone(Edit.userphone);
      setUserTitle(Edit.usertitle);
      setUserEmail(Edit.useremail);
      setUserpassword(Edit.userpassword);
      setuserDept(Edit.userdept);
    }
  }, [Edit]);
  const handleSubmit = (e) => {
    e.preventDefault();
    // put some band aid to password while editing
    editing && setUserpassword("littlefireseverywhere");

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
    } else if (userdept.trim().length < 1) {
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
      Number(userdept) > 0 &&
      userpassword.trim().length > 5
    ) {
      // disable button
      btn.current.disabled = true;

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
        userdept: userdept.trim(),
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
            userdept: userdept.trim(),
            userpassword: userpassword.trim(),
          })
        : data;

      // also update redux state if we're editing
      editing && updateData(data, true);
      // then send to server via jquery ajax, url sent via props
      $.ajax({
        url,
        data,
        type: "POST",
        dataType: "json",
      })

        .then((res) => {
          console.log("user added 1", res);
          // immediately fetch added user from server
          editing === false && updateData({}, false);

          if (res.status === 200) {
            setSuccess(res.msg);
            btn.current.disabled = false;
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
              }
            }, 2000);
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((error) => {
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
        <FormHelperText className="text-success">{successmsg}</FormHelperText>
      </div>

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
  ),
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
}) => {
  const [dept, setdept] = React.useState(userdept);
  React.useEffect(() => {
    setdept(userdept);
  }, [userdept]);

  const handleChange = (e) => {
    //setdept(e.target.value);
    sendValue(e);
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
    </FormControl>
  );
};
