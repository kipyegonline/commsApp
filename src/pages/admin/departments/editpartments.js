import React from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText,
} from "@material-ui/core";
import { editLocal } from "../../../components/helpers";

function EditDepartments({ data, fetchDepts }) {
  const form = React.useRef(null);
  const [success, setSuccess] = React.useState("");
  const [errormsg, setError] = React.useState("");
  const [department, setDept] = React.useState("");
  const [nickname, setDeptNick] = React.useState("");
  React.useEffect(() => {
    setDept(data.department);
    setDeptNick(data.altName);
  }, [data]);
  const handleSubmit = (e) => {
    e.preventDefault();
    // spread the data in there
    const editedData = {
      ...data,
      department,
      altName: nickname,
    };
    /**
     * //remove on prod
    editLocal(data, editedData, "depts");
     */

    $.ajax({
      url: "../../server/departments/departments.php?editdept=true",
      dataType: "json",
      data: editedData,
      type: "POST",
    })
      .then((res) => {
        if (res.status === 200) {
          fetchDepts();
          setSuccess(res.msg);
          setTimeout(() => {
            setDept("");
            setDeptNick("");
            setSuccess("");
            data = {};
          }, 4000);
        } else {
          throw new Error(res.msg);
        }
      })
      .catch((error) => {
        error.message === undefined
          ? setError("Error updating.Try again later")
          : setError(error.message);
        setTimeout(() => setError(""), 3000);
      });
  };

  return data !== undefined ? (
    <div className="row">
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
        <FormControl className="my-1">
          <InputLabel>Department</InputLabel>
          <Input
            autoFocus
            onChange={(e) => setDept(e.target.value)}
            id="dept"
            placeholder=""
            value={department}
            inputProps={{ "aria-label": "description" }}
          />
        </FormControl>
        <FormControl>
          <InputLabel>Short name</InputLabel>
          <Input
            id="nickname"
            onChange={(e) => setDeptNick(e.target.value)}
            placeholder=""
            inputProps={{ "aria-label": "description" }}
            value={nickname}
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
          Edit Department
        </Button>
      </form>
    </div>
  ) : null;
}
EditDepartments.propTypes = {
  data: PropTypes.shape({
    department: PropTypes.string,
    altName: PropTypes.string,
    altId: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};
export default EditDepartments;
