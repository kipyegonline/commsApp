import React from "react";
import { Row, Col } from "reactstrap";
import {
  Grid,
  GridList,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  Box,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import AddUser, { AddDept } from "../components/users/addUsers";
import ShowUsers from "../components/users/showusers";
import Layout from "../components/Layout";
import { fetchData } from "../lib/apicalls";
import * as actions from "../redux/usersReducer/actions";
import * as depts from "../redux/departments/actions";
import { getLocal, handleLocalStorage } from "../components/helpers";

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
  const dispatch = useDispatch();
  const [Edit, setEdit] = React.useState({});
  const [editor, setEditor] = React.useState(false);

  const fetchStats = (url) => {
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        dispatch(actions.setTableUsers(res.data));
      })
      .catch((error) => console.log("stats err", error));
  };

  React.useEffect(() => {
    // fetch data
    /*
    // remove on prod
    dispatch(
      actions.addUser(
        getLocal("users").map((item) => ({
          ...item,
          selected: false,
        }))
      )
    );
    dispatch(
      depts.addDepts(
        getLocal("depts").map((item) => ({
          ...item,
          selected: false,
        }))
      )
    );
    */

    // get the departments and users

    Promise.all([
      fetchData(
        "../server/departments/departments.php?fetchdepts=true"
      ).then((res) => dispatch(depts.addDepts(res))),
      fetchData("./server/users/users.php?fetchusers=true").then((res) =>
        dispatch(actions.addUser(res))
      ),
      fetchStats("../server/users/users.php?fetchuserdeptstats=true"),
    ]);
  }, []);

  // hit the redux store
  const { departments, users, tableUsers, sectionUsers: section } = useSelector(
    (state) => ({
      departments: state.departments.departments,
      users: state.users.users,
      tableUsers: state.users.userStats,
      sectionUsers: state.users.sectionUsers,
    })
  );
  // events

  const handleDelete = (id) => {
    if (confirm("Delete user?")) {
      dispatch(actions.deleteUser(id));
      fetch(`./server/users/users.php?deleteuser=true&userId=${id}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    }
  };
  // edit form,selected data for edit
  const handleEdit = (editId) => {
    const selectedUser = users.find((user) => user.id === editId);
    if (selectedUser) {
      setEdit(selectedUser);
      setEditor(true);
    }
  };
  // send edited data to redux store fetch new user
  const editData = (data, status) => {
    if (status === true) {
      dispatch(actions.editUser(data));
    } else {
      console.log("new user added");
      // fetch added user
      fetchData("./server/users/users.php?fetchusers=true").then((res) =>
        dispatch(actions.addUser(res))
      );
    }
  };
  // get selected dept
  const getSelected = (e = 1) => {
    const id = e.target.value;
    if (id < 1) return;
    dispatch(actions.addsection(id));
  };

  return (
    <Layout>
      <Grid
        container
        spacing={1}
        className={` mx-auto`}
        alignItems="flex-start"
        direction="row-reverse"
        justify="center"
        grow={1}
      >
        <Grid item xs className={`${classes.root} mt-1`} component="div">
          {editor ? (
            <AddUser
              depts={departments}
              Edit={Edit}
              title="Edit User "
              url="./server/users/users.php?edituser=true"
              closeEditor={setEditor}
              updateData={editData}
            />
          ) : (
            <AddUser
              depts={departments}
              title="Add User"
              url="./server/users/users.php?adduser=true"
            />
          )}
        </Grid>
        <Grid item xs className={`${classes.root} my-1`} component="div">
          {departments.length > 0 ? (
            <AddDept depts={departments} sendValue={getSelected} />
          ) : null}
          {section.length > 0 ? (
            <ShowUsers
              users={section}
              deleteKey={handleDelete}
              editKey={handleEdit}
            />
          ) : null}
        </Grid>
        <Grid item xs className={`${classes.root} mb-2`} component="div">
          {tableUsers.length > 0 ? (
            <TableUsers users={users} depts={tableUsers} />
          ) : null}
        </Grid>
      </Grid>
    </Layout>
  );
}
export default Users;

const TableUsers = ({ users = [], depts = [] }) => (
  <Table>
    <caption>
      {users.length} members from
      {depts.length} departments
    </caption>
    <TableHead>
      <TableRow>
        <TableCell scope="col">Department</TableCell>
        <TableCell scope="col">Members</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {depts.map((d) => (
        <UserTable key={d.dept} user={d} />
      ))}
    </TableBody>
  </Table>
);
const UserTable = ({ user = [] }) => (
  <TableRow>
    <TableCell>{user["dept"]}</TableCell>
    <TableCell>{user["members"]}</TableCell>
  </TableRow>
);
