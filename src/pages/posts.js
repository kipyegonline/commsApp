import React from "react";
import Alert from "@material-ui/lab/Alert";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Grid, Divider } from "@material-ui/core";
import * as postactions from "../redux/posts/actions";
import * as useractions from "../redux/usersReducer/actions";
import * as issueactions from "../redux/Issues/actions";
import Layout from "../components/Layout";
import PostsTable, { ToolBar } from "../components/posts/postTable";
import { getLocal, handleLocalStorage } from "../components/helpers";

function Posts() {
  const [errormsg, setError] = React.useState();
  const [issue, setIssue] = React.useState("");
  const [user, setUser] = React.useState("");
  const dispatch = useDispatch();
  // mock auth
  const { uuid, userdept } = { uuid: 20, userdept: 5 };
  const { posts, issues, users } = useSelector((state) => ({
    posts: state.posts.posts,
    issues: state.issues.deptIssues,
    users: state.users.userdepts,
  }));

  // fetch  posts for currently logged in user
  const fetchPosts = (id) => {
    axios
      .get(`./server/posts/posts.php?fetchposts=true&uuid=${id}`)
      .then((res) => dispatch(postactions.addPosts(res.data)))
      .catch((error) => console.error("fetch posts:", error));
  };

  // for other event-based network requests
  const fetchData = (url, callback) => {
    axios
      .get(url)
      .then((res) => dispatch(callback(res.data)))
      .catch((error) => setError("Results not found", error));
  };
  // fetch dept users affiliated with logged in user
  const fetchDeptUsers = (dept) => {
    axios
      .get(`./server/users/users.php?getdeptusers=true&deptId=${dept}`)
      .then((res) => dispatch(useractions.addUserdept(res.data)))
      .catch((error) => console.error("fetch posts:", error));
  };
  // fetch issues belonging to currently logged in user
  const fetchdeptIssues = (dept) => {
    axios
      .get(
        `./server/issues/issues.php?fetchSelectedIssue=true&id=${dept}&uuid=${uuid}`
      )
      .then((res) => dispatch(issueactions.AddDeptissues(res.data)))
      .catch((error) => console.error("fetch posts:", error));
  };
  /** Component did something like mount or side effect, couldnt care less */
  React.useEffect(() => {
    /*
    Promise.all([
      fetchPosts(uuid),
      fetchDeptUsers(userdept),
      fetchdeptIssues(userdept),
    ]);
*/
    // remove on prod
    dispatch(postactions.addPosts(getLocal("posts")));
  }, []);

  /* Events */
  // when one of the buttons is clicked
  const handleButtonGroup = (id) => {
    const url = `./server/posts/posts.php?fetchbyStatus=true&id=${id}&uuid=${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  // when an issue is selected
  const handleSelectedIssues = (id) => {
    setIssue(id);
    const url = `./server/posts/posts.php?fetchbyIssues=true&id=${id}&uuid=${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  //search box
  const handleSearch = (value) => {
    const url = `./server/posts/posts.php?handleSearch=true&keyword=${value}&uuid=${uuid}`;
    fetchData(url, postactions.addPosts);
  };

  //when a user is clicked

  const handleSelectedUsers = (id) => {
    setUser(id);
    const url = `./server/posts/posts.php?fetchbyusers=true&id=${id}&uuid=${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  // set blue ticks when someone views an issue
  const handleBlueTicks = (id) => {
    // dispatch to redux
    dispatch(postactions.setTicks(id));
    // send to server
    axios
      .get(`./server/posts/posts.php?setticks=true&id=${id}&uuid=${uuid}`)
      .then((res) => console.log(res.data))
      .catch((error) => console.log("ticks", error));
  };

  return (
    <Layout>
      <Grid container>
        <ToolBar
          sendGroup={handleButtonGroup}
          issues={issues}
          issue={issue}
          setIssue={handleSelectedIssues}
          users={users}
          user={user}
          getUser={handleSelectedUsers}
          handleSearch={handleSearch}
        />
        <Divider />
        {posts.length ? (
          <PostsTable posts={posts} setTicks={handleBlueTicks} />
        ) : (
          <Alert severity="error" className="text-center my-1 mx-auto w-50 p-1">
            {" "}
            You have no posts
          </Alert>
        )}
      </Grid>
    </Layout>
  );
}
export default Posts;
