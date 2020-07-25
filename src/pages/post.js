import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Typography,
  ButtonGroup,
  Button,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import * as postactions from "../redux/posts/actions";
import * as issueactions from "../redux/Issues/actions";
import Comments from "../components/posts/comments";
import Layout from "../components/Layout";

const useStyles = makeStyles({
  grid: {
    padding: "1rem",
    margin: ".25rem",
    background: "#fefefe",
  },
  mainGrid: {
    width: "58%",
    background: "beige",
  },
});
// mock auth
const { uuid, userdept } = { uuid: 20, userdept: 5 };

const Post = () => {
  const [reloading, setReloading] = React.useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  // get the clicked item from router props
  const {
    query: { issue, title },
  } = useRouter();
  // get the post from redux store
  const { post, comments, issues, recent } = useSelector((state) => ({
    post: state.posts.post,
    comments: state.posts.comments,
    issues: state.issues.deptIssues,
    recent: state.posts.recentPosts,
  }));
  // Re-fetch posts in case of  page reload
  const fetchPost = (userId, postId) => {
    axios
      .get(
        `./server/posts/posts.php?fetchposts=true&uuid=${userId}& postId=${postId}`
      )
      .then((res) => dispatch(postactions.addPost(res.data)))
      .then(() => setReloading(false))
      .catch((error) => console.error("fetch posts:", error));
  };
  // fetch post comments
  const fetchComments = (userId, postId) => {
    axios
      .get(
        `./server/posts/posts.php?fetchcomments=true&uuid=${userId}& postId=${postId}`
      )
      .then((res) => dispatch(postactions.addComments(res.data)))
      .catch((error) => console.error("fetch comments:", error));
  };
  // fetch issues

  const fetchdeptIssues = (dept) => {
    axios
      .get(
        `./server/issues/issues.php?fetchSelectedIssue=true&id=${dept}&uuid=${uuid}`
      )
      .then((res) => dispatch(issueactions.AddDeptissues(res.data)))
      .catch((error) => console.error("fetch posts:", error));
  };

  // fetch 5 recent posts minus the one under review

  const fetchRecentPosts = (userId) => {
    axios
      .get(`./server/posts/posts.php?fetchrecentpost=true&uuid=${userId}`)
      .then((res) => dispatch(postactions.addrecentposts(res.data)))

      .catch((error) => console.error("fetch recent posts:", error));
  };
  // handle page reload
  const handleReload = () => {
    setReloading(true);
    const postAltid = JSON.parse(localStorage.getItem("postAltid"));
    Promise.all([fetchPost(uuid, postAltid), fetchComments(postAltid)]);

    // pole pole
    setTimeout(() => {
      fetchdeptIssues(userdept);
      fetchRecentPosts(uuid);
    }, 2000);
  };
  const handleResolve = (status) => {
    axios
      .get(
        `./server/posts/posts.php?resolveissue=true&uuid=${uuid}&issue=${issue}&status=${status}`
      )
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
    dispatch(postactions.resolveIssue({ status, altId: issue }));
  };
  React.useEffect(() => {
    // if the post id is already on router params
    if (issue) {
      // Get clicked post since its already on redux store
      dispatch(postactions.getPost(issue));
      // fetch posts comments,if any
      fetchComments(issue);
      // store local storage for purposes of page reload and all that
      localStorage.setItem("postAltid", JSON.stringify(issue));
    }
    // fetch issues and recent posts pole pole
    setTimeout(() => {
      fetchdeptIssues(userdept);
      fetchRecentPosts(uuid);
    }, 2000);
    // listen to load event, reload that is
    window.addEventListener("load", handleReload);
  }, []);
  // handle added comments  sent up from addcomments component
  const getValue = (data) => {
    dispatch(postactions.addComment(data));
  };
  console.log("The post", post, issue);

  return (
    <Layout title={title}>
      {!reloading ? (
        <Grid container spacing={2} alignItems="flex-start" justify="center">
          <Grid item xs={0} md={3}>
            <p>Issues</p>
          </Grid>
          <Grid item className={classes.mainGrid} xs={12} md={6}>
            {" "}
            {post && "issue" in post ? (
              <>
                <PostDetails {...post} handleResolve={handleResolve} />
                <Comments
                  comments={comments}
                  sendValue={getValue}
                  post_id={issue}
                  handler_id={post.handler_id}
                />
              </>
            ) : (
              <Box>
                <CircularProgress color="primary" />
                <p>Reloading</p>
              </Box>
            )}
          </Grid>
          <Grid item xs={0} md={3}>
            <p>Recent</p>
          </Grid>
        </Grid>
      ) : (
        <Skeleton
          width={document.documentElement.clientWidth}
          height={document.documentElement.clientHeight}
          animation="wave"
          variant="rect"
        >
          <CircularProgress color="primary" className="max-auto my-auto" />
        </Skeleton>
      )}
    </Layout>
  );
};

export default Post;

const PostDetails = ({
  issue,
  clientOrg,
  clientPhone,
  clientEmail,
  clientName,
  subject,
  message,
  addedBy,
  handler_id,
  status,
  addedon,
  handleResolve,
}) => (
  <Box className="my-2 p-2">
    <h5> {subject}</h5>
    <Divider />
    <Box>
      <Typography> {message}</Typography>
    </Box>

    <Divider />
    <Box>
      <h6>Name: {clientName}</h6>
      <h6>
        Contacts: {clientPhone}, ({clientEmail})
      </h6>
      <h6>Company/location: {clientOrg}</h6>
    </Box>
    <Box>
      <small>
        {" "}
        Added by {addedBy} on {addedon}
      </small>
      <Typography>Status: {+status}</Typography>
    </Box>
    <Box>
      {/* Restriction */}
      {handler_id === uuid ? (
        <ButtonGroup className="my-2">
          <Button
            variant={+status === 1 ? "contained" : "outlined"}
            size="small"
            color="primary"
            className="mr-2 my-2"
            onClick={() => handleResolve(1)}
          >
            {+status === 1 ? "In Progress" : "Put in progress"}
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            className="bg-success ml-1 my-2"
            onClick={() => handleResolve(2)}
          >
            {+status === 2 ? "Resolved" : "Resolve"}
          </Button>
        </ButtonGroup>
      ) : null}
    </Box>
  </Box>
);
