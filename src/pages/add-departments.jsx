import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Pagination, Alert } from "@material-ui/lab";
import { v4 } from "uuid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import FetchDepts from "../lib/api/depts";
import Layout from "../components/Layout";
import ShowDepts from "../components/admin/departments/showdepts";
import * as actions from "../redux/departments/actions";
import { getLocal, handleLocalStorage } from "../components/helpers";
import EditDepartments from "../components/admin/departments/editpartments";

import { CircularProgress, Typography } from "@material-ui/core";
const useStyles = makeStyles({
  grid: {
    minWidth: 360,
    width: "32%",
  },
});
function AddDepartments() {
  // set up state;
  const [editData, setEditData] = React.useState({});
  const [isEditing, setEditing] = React.useState(false);

  const [current, setCurrent] = React.useState(0);
  const classes = useStyles();
  const { departments, errormsg } = useSelector((state) => ({
    departments: state.departments.departments,
    errormsg: state.departments.errorMsg,
  }));
  // for paginatiom
  const perpage = departments.length < 10 ? departments.length : 10;
  const pages = Math.ceil(departments.length / perpage);
  const dispatch = useDispatch();

  const handlePagination = (e, p) => setCurrent(p - 1);
  // use effect
  React.useEffect(() => {
    if (departments.length) return;
    FetchDepts("/departments/fetchdepts/true", dispatch);
  }, []);

  return (
    <Layout>
      <Grid
        spacing={3}
        justify="center"
        className="py-4 px-2 my-2"
        alignItems="flex-start"
        container
      >
        <Grid item className={`card ${classes.grid} `} xs>
          <AddUsers fetchDepts={FetchDepts} />
        </Grid>
        <Grid item className={`card ${classes.grid}`} xs>
          <p className="text-center alert alert-primary my-2">
            {" "}
            {departments.length || ""} Departments
          </p>
          {/* eslint-disable no-nested-ternary */}
          {departments.length ? (
            <ShowDepts
              depts={departments}
              sendValue={setEditData}
              currentPage={current}
              perpage={perpage}
              setEditing={setEditing}
            />
          ) : !errormsg ? (
            <div className="mx-auto my-4 text-center p-4">
              <CircularProgress color="primary" size="3rem" />
              <Typography>Loading departments</Typography>
            </div>
          ) : (
            <div className="p-4">
              <Alert severity="error">
                {" "}
                <p>{errormsg}</p>
              </Alert>
            </div>
          )}
          {departments.length > 10 ? (
            <Pagination
              count={pages}
              color="primary"
              rounded
              page={current + 1}
              defaultValue={1}
              onChange={handlePagination}
            />
          ) : null}
        </Grid>
        <Grid item className={`card ${classes.grid} `} xs>
          {isEditing ? (
            <EditDepartments
              data={editData}
              setEditing={setEditData}
              fetchDepts={FetchDepts}
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
  const [loading, setLoading] = React.useState(false);
  const form = React.useRef();
  const dispatch = useDispatch();

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
      setLoading(true);
      axios
        .post("/departments/adddept/true", {
          department: dept,
          altName: deptNick,
          altId: v4(),
        })
        .then((res) => {
          const { data } = res;
          if (data.status === 200) {
            setSuccess(data.msg);
            // refetch from server

            fetchDepts("/departments/fetchdepts/true", dispatch);

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
        })
        .finally(() => setLoading(false));
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
        disabled={loading}
        aria-label="move all right"
      >
        {loading ? "Adding department" : "Add Department"}
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
