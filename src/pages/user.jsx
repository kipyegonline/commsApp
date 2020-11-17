import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import AddUser, { AddDept, SearchUser } from "../components/users/addUsers";
import Layout from "../components/Layout";
import * as useractions from "../redux/usersReducer/actions";
import { Typography } from "@material-ui/core";

function AddEditUser() {
  const [Edit, setEdit] = React.useState({});

  const [editor, closeEditor] = React.useState(false);
  const {
    query: { q },
  } = useRouter();
  const dispatch = useDispatch();
  // hit the redux store
  const { departments, user } = useSelector((state) => ({
    departments: state.departments.departments,
    user: state.users.user,
  }));
  React.useEffect(() => {
    if (q) {
      closeEditor(q !== "add");
      //if we are adding,empty the user object on redux store
      q !== "add"
        ? dispatch(useractions.addOneUser(q))
        : dispatch(useractions.editUser({}));
      setEdit(user);
    }
  }, [editor]);
  React.useEffect(() => {
    setEdit(user);
  }, [user]);

  const handleUpdate = (data) => dispatch(useractions.editUser(data));

  return (
    <Layout title="User">
      {editor ? (
        <>
          <AddUser
            depts={departments}
            isEditing={editor}
            setEdit={setEdit}
            Edit={Edit}
            title="Edit User "
            url="/users/edituser"
            updateData={handleUpdate}
            closeEditor={closeEditor}
          />
        </>
      ) : (
        <>
          <AddUser
            depts={departments}
            isEditing={editor}
            updateData={handleUpdate}
            title="Add User"
            url="/users/adduser"
          />
        </>
      )}
      <div className="flex justify-center p-2">
        <Link href="/users">
          <a>Back to users</a>
        </Link>
      </div>
    </Layout>
  );
}
export default AddEditUser;
