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
import Router from "next/router";

function ShowUsers({ users = [], deleteKey = (f) => f }) {
  const [current, setCurrent] = React.useState(0);
  const perpage = users.length > 10 ? 10 : users.length;
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
        start={start}
      />
      {users.length > 10 ? (
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

export default ShowUsers;

const TableUsers = ({
  users = [],
  deleteKey = (f) => f,

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
  userAltId,
  dept,
  index,
}) => (
  <TableRow>
    <TableCell>{index + 1}</TableCell>
    <TableCell>{username}</TableCell>
    <TableCell>{dept}</TableCell>
    <TableCell>{usertitle}</TableCell>
    <TableCell>{useremail}</TableCell>
    <TableCell>{userphone}</TableCell>
    <TableCell>
      <IconButton onClick={() => Router.push(`/user?q=${userAltId}`)}>
        <Edit color="primary" fontSize="small" />
      </IconButton>
    </TableCell>
    <TableCell>
      <IconButton onClick={() => deleteKey(id)}>
        <Delete color="secondary" fontSize="small" />
      </IconButton>
    </TableCell>
  </TableRow>
);
const PureTableList = React.memo(
  TableList,
  (PrevProps, nextProps) => PrevProps.id === nextProps.id
);
