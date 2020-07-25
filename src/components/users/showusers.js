import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
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

      <TableUsers
        users={users.slice(start, end)}
        deleteKey={deleteKey}
        editKey={editKey}
        start={start}
      />
      {users.length > 0 ? (
        <Box>
          <Pagination
            color="primary"
            count={pages}
            defaultValue={current + 1}
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

const TableUsers = ({
  users = [],
  deleteKey = (f) => f,
  editKey = (f) => f,
  start = 0,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, i) => (
            <TableList
              key={user.id}
              {...user}
              deleteKey={deleteKey}
              editKey={editKey}
              index={i + start}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const TableList = ({
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
}) => (
  <TableRow>
    <TableCell>{index + 1}</TableCell>
    <TableCell>{username}</TableCell>
    <TableCell>{userdept}</TableCell>
    <TableCell>{usertitle}</TableCell>
    <TableCell>{useremail}</TableCell>
    <TableCell>{userphone}</TableCell>
    <TableCell>
      <IconButton onClick={() => editKey(id)}>
        <Edit color="primary" />
      </IconButton>
    </TableCell>
    <TableCell>
      <IconButton onClick={() => deleteKey(id)}>
        <Delete color="secondary" />
      </IconButton>
    </TableCell>
  </TableRow>
);
