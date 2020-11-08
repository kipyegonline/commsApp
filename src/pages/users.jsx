import React from "react";

import {
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  ButtonGroup,
  Box,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import AddUser, { AddDept, SearchUser } from "../components/users/addUsers";
import ShowUsers from "../components/users/showusers";
import Layout from "../components/Layout";
import {
  fetchData,
  fetchStats,
  deleteUser,
  editUser,
  getSelected,
  fetchLocalData,
  fetchSearch,
} from "../lib/api/users";

import * as depts from "../redux/departments/actions";
import * as actions from "../redux/usersReducer/actions";

const useStyles = makeStyles({
  root: {
    background: "#fff",
    padding: ".75rem",
    margin: ".75rem auto",
    width: "30%",

    "@media (max-width:480px)": {
      background: "#fff",
      marginBottom: "1rem",
      flexDirection: "column",
      width: "100%",
    },
    "@media (max-width:768px)": {
      background: "#fff",
      marginBottom: "1rem",
      flexDirection: "column",

      width: "90%",
    },
  },
  container: {
    border: "1px solid yellow",
    width: "100%",
  },
});

function Users() {
  // initiliazie classes and state
  const classes = useStyles();

  const [Edit, setEdit] = React.useState({});
  const [editor, setEditor] = React.useState(false);
  const [showForm, setForm] = React.useState(false);

  const dispatch = useDispatch();
  const fetchAllDepts = () => {
    fetchData("/departments/fetchdepts/true").then((res) =>
      dispatch(depts.addDepts(res))
    );
  };
  const fetchAllUsers = () => {
    fetchData("/users/fetchusers").then((res) =>
      dispatch(actions.addUser(res))
    );
  };
  React.useEffect(() => {
    // fetch data

    //fetchLocalData(dispatch);

    // get the departments and users

    Promise.all([
      fetchAllDepts(),
      fetchAllUsers(),
      fetchStats("/users/fetchuserdeptstats", dispatch),
    ]);
  }, []);

  // hit the redux store
  const {
    departments,
    users,
    tableUsers,
    sectionUsers: section,
    department,
  } = useSelector((state) => ({
    departments: state.departments.departments,
    users: state.users.users,
    tableUsers: state.users.userStats,
    sectionUsers: state.users.sectionUsers,
    department: state.users.department,
  }));
  // event handlers

  // delete user
  const handleDelete = (id) => {
    if (confirm("Delete user?")) deleteUser(id, dispatch);
  };
  // edit form,selected data for edit
  const handleEdit = (editId) => {
    const selectedUser = users.find((user) => user.id === editId);
    if (selectedUser) {
      setEdit(selectedUser);
      setEditor(true);
      setForm(true);
    }
  };
  const handleTableClik = (id) => {
    console.log(id);
    getSelected(id);
  };
  // send edited data to redux store fetch new user
  const editData = (data, status) => editUser(data, status, dispatch);
  const closeEditor = () => setEditor(false);

  return (
    <Layout>
      <Grid
        container
        spacing={1}
        className={`mx-auto my-1`}
        alignItems="flex-start"
        direction="row-reverse"
        justify="center"
        grow={1}
      >
        <Grid
          item
          md={4}
          xs={12}
          className={`${classes.root} mt-5`}
          component="div"
        >
          {/* Edit user */}
          {editor ? (
            <AddUser
              depts={departments}
              isEditing={editor}
              setEdit={setEdit}
              Edit={Edit}
              title="Edit User "
              url="/users/edituser"
              updateData={editData}
              closeEditor={closeEditor}
            />
          ) : (
            <AddUser
              depts={departments}
              isEditing={editor}
              updateData={editData}
              title="Add User"
              url="/users/adduser"
            />
          )}
          {tableUsers.length > 0 ? (
            <TableUsers
              users={users}
              depts={tableUsers}
              handleClick={handleTableClik}
            />
          ) : null}
        </Grid>
        <Grid
          item
          md={8}
          xs={12}
          className={`${classes.root} my-1`}
          component="div"
        >
          <Grid container>
            <Grid item>
              {" "}
              {departments.length > 0 ? (
                <AddDept
                  depts={departments}
                  department={department}
                  sendValue={getSelected}
                />
              ) : null}
            </Grid>
            <Grid item>
              {" "}
              <SearchUser getSearch={fetchSearch} />
            </Grid>
            <Grid item>
              <ButtonGroup className=" ml-3 mt-4">
                <Button
                  variant="outlined"
                  color="primary"
                  className=" mr-2"
                  size="small"
                  onClick={fetchAllUsers}
                >
                  See All
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className=" ml-2"
                  onClick={() => setEditor(false)}
                >
                  {editor ? "Editing user" : "Add User"}
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>

          {section.length > 0 ? (
            <ShowUsers
              users={section}
              deleteKey={handleDelete}
              editKey={handleEdit}
            />
          ) : null}
        </Grid>
      </Grid>
    </Layout>
  );
}
export default Users;

const TableUsers = ({ users = [], depts = [], handleClick = (f) => f }) => (
  <Table>
    <caption>
      {users.length} members from
      {depts.length} departments
    </caption>
    <TableHead>
      <TableRow>
        <TableCell scope="col">#</TableCell>
        <TableCell scope="col">Department</TableCell>
        <TableCell scope="col">Members</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {depts.map((d, i) => (
        <UserTable
          key={d.dept}
          user={d}
          index={i + 1}
          handleClick={handleClick(d.id)}
        />
      ))}
    </TableBody>
  </Table>
);
const UserTable = ({ user = {}, handleClick = (f) => f }) => (
  <TableRow
    onClick={handleClick}
    className={user.clicked ? "bg-red-500 text-white" : "bg-white"}
  >
    <TableCell>{index}</TableCell>
    <TableCell>{user["dept"]}</TableCell>
    <TableCell>{user["members"]}</TableCell>
  </TableRow>
);
