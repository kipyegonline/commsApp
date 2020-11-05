import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import { v4 } from "uuid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import ShowDepts from "../components/admin/departments/showdepts";
import * as actions from "../redux/departments/actions";
import { getLocal, handleLocalStorage } from "../components/helpers";
import EditDepartments from "../components/admin/departments/editpartments";

const useStyles = makeStyles({
  grid: {
    minWidth: 360,
    width: "32%",
  },
});
function AddDepartments() {
  const [editData, setEditData] = React.useState({});
  const [isEditing, setEditing] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const classes = useStyles();
  const { departments } = useSelector((state) => ({
    departments: state.departments.departments,
  }));
  const perpage = departments.length < 10 ? departments.length : 10;
  const pages = Math.ceil(departments.length / perpage);
  const dispatch = useDispatch();
  // get departments from server
  const fetchDepts = async () => {
    try {
      const res = await fetch("/departments/fetchdepts");
      if (res.ok) {
        const data = await res.json();
        //  using redux soon

        dispatch(actions.addDepts(data));
      }
    } catch (error) {
      console.log("fetch error");
    }
    /** // remove this during production
    dispatch(actions.addDepts(getLocal("depts"))) */
  };
  const handlePagination = (e, p) => setCurrent(p + 1);
  // use effect
  React.useEffect(() => {
    fetchDepts();
  }, []);

  return (
    <Layout>
      <Grid
        className="jumbotron"
        spacing={3}
        justify="center"
        alignItems="flex-start"
        container
      >
        <Grid item className={`card ${classes.grid} `} xs>
          <AddUsers fetchDepts={fetchDepts} />
        </Grid>
        <Grid item className={`card ${classes.grid}`} xs>
          <p className="text-center alert alert-primary my-2">
            {" "}
            {departments.length || ""} Departments
          </p>
          <ShowDepts
            depts={departments}
            sendValue={setEditData}
            currentPage={current}
            perpage={perpage}
            setEditing={setEditing}
          />
          {departments.length > 10 ? (
            <Pagination
              count={pages}
              color="primary"
              rounded
              page={current + 1}
              defaultPage={1}
              onChange={handlePagination}
            />
          ) : null}
        </Grid>
        <Grid item className={`card ${classes.grid} my-2`} xs>
          {isEditing ? (
            <EditDepartments
              data={editData}
              setEditing={setEditData}
              fetchDepts={fetchDepts}
            />
          ) : null}
        </Grid>
      </Grid>
    </Layout>
  );
}
export default AddDepartments;

export const AddUsers = ({ fetchDepts }) => {
  const [errormsg, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dept, setDept] = useState("");
  const [deptNick, setDeptNick] = useState("");
  const form = React.useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (dept.trim().length > 0) {
      /*
      // remove during prod
      handleLocalStorage({
        department: dept,
        altName: deptNick,
        altId: v4(),
      },"depts"); */
      // send to the server via ajax
      $.ajax({
        url: "../server/departments/departments.php?adddept=true",
        type: "POST",
        dataType: "json",
        data: {
          department: dept,
          altName: deptNick,
          altId: v4(),
        },
      })
        .then((res) => {
          console.log(res, "feed");
          if (res.status === 200) {
            setSuccess(res.msg);
            // refetch from server
            fetchDepts();

            setTimeout(() => {
              // clean up the form and state
              setDeptNick("");
              setDept("");
              form.current.reset();
              setSuccess("");
            }, 1000);
          } else {
            setSuccess("");
            throw new Error("Error adding department. Try again later.");
          }
        })
        .catch((error) => {
          error.message !== undefined
            ? setError(error.message)
            : setError("Encountered a connection error.Try again");
          console.log(error.message);
          setTimeout(() => setError(""), 3000);
        });
    } else {
      setError("Add a department");
      setTimeout(() => setError(""), 3000);
    }
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
      justify="center"
      spacing={2}
      onSubmit={handleSubmit}
      ref={form}
    >
      <p>Add company departments</p>
      <FormControl className="my-3">
        <InputLabel>Add Department</InputLabel>
        <Input
          onChange={(e) => setDept(e.target.value)}
          id="dept"
          placeholder=""
          variant="filled"
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Department short name</InputLabel>
        <Input
          id="nickname"
          onChange={(e) => setDeptNick(e.target.value)}
          placeholder=""
          variant="outlined"
          inputProps={{ "aria-label": "description" }}
        />
      </FormControl>

      <FormHelperText className="text-success ml-2 my-2">
        {success}
      </FormHelperText>
      <FormHelperText className="text-danger ml-2 mb-2">
        {errormsg}
      </FormHelperText>

      <Button
        variant="contained"
        size="medium"
        type="submit"
        color="primary"
        aria-label="move all right"
      >
        Add Department
      </Button>
    </form>
  );
};
PropTypes.AddUsers = {
  fetchDepts: PropTypes.func.isRequired,
};
const UpdateUser = () => {
  return (
    <div className="my-5">
      <form className="form" noValidate autoComplete="on">
        <TextField label="Standard" />
      </form>
    </div>
  );
};

const setStyle = (bg) => ({
  width: 40,
  display: "inline-block",
  background: "red",
  padding: ".5rem",
  margin: ".5rem",
  textAlign: "center",
  lineHeight: "1em",
  border: "2px solid red",
  backgroundColor: bg ? "red" : "transparent",
  color: bg ? "white" : "",
  height: 40,
  borderRadius: "50%",
});
