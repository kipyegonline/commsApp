import React from "react";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ListItemText from "@material-ui/core/ListItemText";

import PropTypes, { array } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux/departments/actions";

const ShowDepts = ({
  depts,
  currentPage,
  perpage,
  sendValue = (f) => f,
  setEditing = (f) => f,
}) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (confirm("Are you sure about it?")) {
      console.log(id);
      dispatch(actions.deleteDept(id));
      axios
        .get(`/departments/deletedept/${id}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log("delete", error));
    }
  };
  const handleEdit = (item) => {
    sendValue(item);
    setEditing(true);
  };
  return (
    <>
      <List>
        {depts !== undefined
          ? depts
              .slice(currentPage * perpage, currentPage * perpage + perpage)
              .map((item, i) => (
                <ListItem key={item.id} divider>
                  {i + 1 + currentPage * perpage}.{item.department}{" "}
                  <ListItemIcon className=" ml-5 float-right">
                    <DeleteIcon
                      color="secondary"
                      onClick={() => handleDelete(item.id)}
                    />{" "}
                    |{" "}
                    <EditIcon
                      color="primary"
                      onClick={() => handleEdit(item)}
                    />
                  </ListItemIcon>
                </ListItem>
              ))
          : ""}
      </List>
    </>
  );
};

ShowDepts.propTypes = {
  depts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      department: PropTypes.string,
    })
  ).isRequired,
};
ShowDepts.defautlProps = { depts: [] };

export default ShowDepts;
