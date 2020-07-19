import React from "react";
import {
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Box,
  FormHelperText,
} from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";

function ShowUsers({ users = [], deleteKey = (f) => f, editKey = (f) => f }) {
  const [current, setCurrent] = React.useState(0);
  const perpage = 10;
  const pages = Math.ceil(users.length / perpage);
  const start = current * perpage;
  const end = current * perpage + perpage;
  const handleChange = (e, p) => setCurrent(p - 1);
  return (
    <>
      <p className="alert alert-info text-center p-1 w-100 my-1">
        {users.length > 0 ? `${users.length} users` : ""}
      </p>
      <List dense style={{ width: "100%", padding: "0.5rem" }}>
        {users.slice(start, end).map((user, i) => (
          <User
            {...user}
            deleteKey={deleteKey}
            editKey={editKey}
            key={user.id}
            index={i}
          />
        ))}
      </List>
      {users.length > 0 ? (
        <Box>
          <Pagination
            color="primary"
            count={pages}
            defaultPage={current + 1}
            size="large"
            onChange={handleChange}
          />
        </Box>
      ) : null}
    </>
  );
}
const User = ({
  username,
  id,
  department,
  userdept,
  userphone,
  useremail,
  usertitle,
  deleteKey,
  editKey,
  index,
}) => {
  return (
    <ListItem className="card my-2 p-3" divider alignItems="flex-start">
      <Box component="div">
        <p className="font-weight-bold">
          {index + 1}. {username}{" "}
        </p>

        <FormHelperText>Department: {department}</FormHelperText>
        <FormHelperText>Title: {usertitle}</FormHelperText>
        <FormHelperText>Email: {useremail}</FormHelperText>
        <FormHelperText>Phone: {userphone}</FormHelperText>
        <ListItemIcon component="span" className="ml-3">
          <Delete color="secondary" onClick={() => deleteKey(id)} /> |
          <Edit color="primary" onClick={() => editKey(id)} />
        </ListItemIcon>
      </Box>
    </ListItem>
  );
};
export default ShowUsers;
