import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText,
} from "@material-ui/core";
import { editLocal } from "../../helpers";

function EditDepartments({
  data = {},
  fetchDepts = (f) => f,
  setEditing = (f) => f,
}) {
  const form = React.useRef(null);
  const [success, setSuccess] = React.useState("");
  const [errormsg, setError] = React.useState("");
  const [department, setDept] = React.useState("");
  const [nickname, setDeptNick] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
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
    if (!nickname || !department) return;
    setLoading(true);
    axios
      .post("/departments/editdept/true", { ...editedData })
      .then((res) => {
        if (res.status === 200) {
          fetchDepts("/departments/fetchdepts/true", dispatch);
          setEditing(false);
          setSuccess(res.msg);
          setTimeout(() => {
            setDept("");
            setDeptNick("");
            setSuccess("");
          }, 2000);
        } else {
          throw new Error(res.msg);
        }
      })
      .catch((error) => {
        error.message === undefined
          ? setError("Error updating.Try again later")
          : setError(error.message);
        setTimeout(() => setError(""), 3000);
      })
      .finally(() => setLoading(false));
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
          disabled={loading}
        >
          {loading ? "updating" : "Update changes"}
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
