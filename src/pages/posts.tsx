// /* eslint-disable*/
import React from "react";
import Router from "next/router";
import Alert from "@material-ui/lab/Alert";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Grid, Divider, CircularProgress, TextField } from "@material-ui/core";
import * as postactions from "../redux/posts/actions";
import * as useractions from "../redux/usersReducer/actions";
import * as issueactions from "../redux/Issues/actions";
import Layout, { useAuth } from "../components/Layout";
import PostsTable, { ToolBar } from "../components/posts/postTable";
import Pagination from "@material-ui/lab/Pagination";
//import { getLocal, handleLocalStorage } from "../components/helpers";

function Posts() {
  const [errormsg, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [issue, setIssue] = React.useState("");
  const [user, setUser] = React.useState("");
  const [current, setCurrent] = React.useState(0);
  const [userId, setUserId] = React.useState<{
    uuid?: number;
    userdept?: number;
  }>({});
  const dispatch = useDispatch();
  let fetchTimer;
  // mock auth
  let { uuid, userdept } = userId;
  // pull data from redux store
  const { posts, issues, users } = useSelector((state: any) => ({
    posts: state.posts.posts,
    issues: state.issues.deptIssues,
    users: state.users.userdepts,
  }));

  // fetch  posts for currently logged in user

  const fetchPosts = (id: number | undefined) => {
    setLoading(true);
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("No data found");
        } else if (!res.data.length) {
          throw new Error("There are no posts at the moment");
        }

        dispatch(postactions.addPosts(res.data));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // for other event-based network requests
  const fetchData = (url: string, callback: <T>(data: T) => void) => {
    setLoading(true);
    clearTimeout(fetchTimer);
    axios
      .get(url)
      .then((res) => {
        if (!res?.data.length || !Array.isArray(res.data)) {
          dispatch(callback([]));
          throw new Error("No data found");
        }

        const { data } = res;
        dispatch(callback(data));
      })
      .catch((error) => {
        setError("Error: " + error.message);

        fetchTimer = setTimeout(() => {
          errormsg.length && fetchPosts(uuid);
          setError("");
        }, 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // fetch dept users affiliated with logged in user
  const fetchDeptUsers = (
    dept: string | number | undefined,
    uuid: number | undefined
  ) => {
    axios
      .get(`/posts/deptusers/${dept}/${uuid}`)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          dispatch(useractions.addUserdept([]));
          throw new Error("No data found");
        }
        const { data } = res;
        dispatch(useractions.addUserdept(data));
      })
      .catch((error) => error);
    //.finally(() => console.log("finally"));
  };

  // fetch issues belonging to currently logged in user
  const fetchdeptIssues = (
    dept: number | undefined,
    uuid: number | undefined
  ) => {
    axios
      .get(`/posts/issues/${dept}/${uuid}`)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          dispatch(issueactions.AddDeptissues([]));
          throw new Error("No data found");
        }
        dispatch(issueactions.AddDeptissues(res.data));
      })
      .catch((error) => error);
  };
  /** Component did something like mount or side effect, couldnt care less */
  React.useEffect(() => {
    // fetch info for logged in user
    setUserId(useAuth());
    const { uuid, userdept } = useAuth();
    console.log("Effect Render", uuid);
    // return if the data is already there
    if (!posts.length || !issues.length || !users.length) {
      Promise.all([
        fetchPosts(uuid),
        fetchDeptUsers(userdept, uuid),
        fetchdeptIssues(userdept, uuid),
      ]);
    }

    /* 
    //remove on prod*/
    // dispatch(postactions.addPosts(JSON.parse(localStorage.getItem("posts"))));
  }, []);

  /* Events */
  //pagination
  const handleChange = (
    e: React.ChangeEvent<HTMLElement | unknown>,
    p: number
  ) => setCurrent(p + 1);
  // when one of the buttons is clicked
  const handleButtonGroup = (id: number) => {
    const url = `/posts/btngroup/${id}/${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  // when an issue is selected
  const handleSelectedIssues = (id: string) => {
    setIssue(id);

    const url = `/posts/fetchdeptIssues/${id}/${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  //search box
  const handleSearch = (value: string) => {
    const url = `/posts/search/${value}/${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  const handledate = (value: string) => {
    const url = `/posts/fetchdates/${value}/${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  // when the date is selected
  //when a user is clicked

  const handleSelectedUsers = (id: string) => {
    setUser(id);

    const url = `/posts/fetchdeptusers/${id}/${uuid}`;
    fetchData(url, postactions.addPosts);
  };
  // set blue ticks when someone views an issue
  const handleBlueTicks = (id: number) => {
    // dispatch to redux
    dispatch(postactions.setTicks(id));
    // send to server
    axios
      .get(`/posts/setticks/${id}/${uuid}`)
      .then((res) => console.log(res.data))
      .catch((error) => console.log("ticks", error));
  };
  console.log("Posts Render", uuid);
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
          getDate={handledate}
        />
        <Divider />

        {posts.length ? (
          <>
            <PostsTable
              posts={posts}
              setTicks={handleBlueTicks}
              userId={uuid}
            />
          </>
        ) : loading ? (
          <div className="text-center mx-auto my-4 p-4">
            <CircularProgress size="3rem" />
          </div>
        ) : (
          <Alert severity="error" className="text-center my-1 mx-auto w-50 p-1">
            {" "}
            {errormsg}
          </Alert>
        )}
      </Grid>
    </Layout>
  );
}
export default Posts;
