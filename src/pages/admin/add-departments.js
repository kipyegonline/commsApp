import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { v4 } from "uuid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import ShowDepts from "./departments/showdepts";
import * as actions from "../../redux/departments/actions";
import { getLocal, handleLocalStorage } from "../../components/helpers";
import EditDepartments from "./departments/editpartments";

function AddDepartments() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [editData, setEditData] = React.useState({});
  const [isEditing, setEditing] = Reat.useState(false);
  const { departments } = useSelector((state) => ({
    departments: state.departments.departments,
  }));
  const dispatch = useDispatch();
  // get departments from server
  const fetchDepts = async () => {
    try {
      const res = await fetch(
        "../server/departments/departments.php?fetchdepts=true"
      );
      if (res.ok) {
        let data = await res.json();
        //  using redux soon

        dispatch(actions.addDepts(data));
      }
    } catch (error) {
      console.log("fetch error");
    }
    /** // remove this during production
    dispatch(actions.addDepts(getLocal("depts"))) */
  };

  // use effect
  React.useEffect(() => {
    fetchDepts();
  }, []);

  return (
    <Layout>
      <Row className="jumbotron">
        <Col size="4" className="card">
          <AddUsers fetchDepts={fetchDepts} />
        </Col>
        <Col size="8">
          <p className="text-center alert alert-primary my-2">
            {" "}
            {departments.length} Departments
          </p>
          <ShowDepts
            depts={departments}
            sendValue={setEditData}
            currentPage={currentPage}
            perpage={10}
            setEditing={setEditData} 
          />
          {departments.length > 10 ? (
            <Pagination
              dataset={departments}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          ) : null}
        </Col>
        <Col size="2">
          {(isEditing) ?
            <EditDepartments data={editData} setEditing={setEditData} fetchDepts={fetchDepts} /> : { ""}}
        </Col>
      </Row>
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
const pagine = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const Pagination = ({ dataset, setCurrentPage }) => {
  const [pages, setPages] = React.useState([]);
  // pagination
  const perpage = 10;
  const generatePages = (data, pernums) => {
    let pages = Math.ceil(data.length / pernums);
    pages = [...Array(pages)].map((p, i) =>
      i === 0 ? { clicked: true, num: i } : { clicked: false, num: i }
    );
    return pages;
  };
  React.useEffect(() => {
    const gpages = generatePages(dataset, perpage);

    setPages(gpages);
  }, []);
  const getPage = (page) => {
    setCurrentPage(page);

    setPages(
      pages.map((p) =>
        p.num === page ? { ...p, clicked: true } : { ...p, clicked: false }
      )
    );
  };

  return (
    <div style={pagine}>
      {pages.map((page) => (
        <span
          className="text-center"
          style={setStyle(page.clicked)}
          key={page.num}
          onClick={() => getPage(page.num)}
        >
          {page.num + 1}
        </span>
      ))}
    </div>
  );
};
