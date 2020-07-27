import React from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector, ReactReduxContext } from "react-redux";
import {
  Box,
  Card,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Typography,
  ButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
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
  const [related, setRelated] = React.useState([]);
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
      .then((res) => {
        if (!res.data) {
          throw new Error("No payload attached");
        }

        dispatch(postactions.addComments(res.data));
      })
      .catch((error) => console.error("fetch comments:", error));
  };
  // fetch issues

  const fetchRelatedIssues = (uuid) => {
    axios
      .get(`./server/issues/issues.php?fetchRelatedIssues=true&&uuid=${uuid}`)
      .then((res) => {
        console.log("issues", res);
        if (res.data) {
          if (res.data.length)
            return res.data.map((item) => ({ ...item, selected: false }));
        }
        throw new Error("No payload attached");
      })
      .then((res) => setRelated(res))
      .catch((error) => console.error("fetch issues:", error));
  };

  // fetch 5 recent posts minus the one under review

  const fetchRecentPosts = (userId, issue, recent) => {
    axios
      .get(
        `./server/posts/posts.php?fetchrecentpost=true&uuid=${userId}&current=${issue}&recent=${recent}`
      )
      .then((res) => {
        if (res.data) {
          if (res.data.length)
            return res.data.map((item) => ({ ...item, selected: false }));
        }

        throw new Error("No payload attached");
      })
      .then((res) => dispatch(postactions.addrecentposts(res)))

      .catch((error) => console.error("fetch recent posts:", error));
  };
  // handle page reload
  const handleReload = () => {
    setReloading(true);
    const postAltid = JSON.parse(localStorage.getItem("postAltid"));
    Promise.all([fetchPost(uuid, postAltid), fetchComments(postAltid)]);

    // pole pole
    setTimeout(() => {
      fetchRelatedIssues(uuid);
      fetchRecentPosts(uuid, issue, true);
    }, 2000);
  };
  //when a recent post is clicked
  const getRecent = (post) => {
    dispatch(postactions.recentClicked(post));
  };
  const getRelated = (issue) => {
    let issues = related.map((item) =>
      item.issue === issue
        ? { ...item, selected: true }
        : { ...item, slected: false }
    );
    setRelated(issues);
    fetchRecentPosts(uuid, issue.issueId, false);
  };
  const handleResolve = (status) => {
    axios
      .get(
        `./server/posts/posts.php?resolveissue=true&uuid=${uuid}&issue=${issue}&status=${status}`
      )
      .then((res) => {
        if (status === 2) fetchRecentPosts(uuid);
      })
      .catch((error) => console.log(error));
    dispatch(postactions.resolveIssue({ status, altId: issue }));
  };
  React.useEffect(() => {
    // if the post id is already on router params
    if (issue) {
      // Get clicked post since its already on redux store
      dispatch(postactions.getPost(issue));
      // fetch posts comments,if any
      fetchComments(uuid, issue);
      // store local storage for purposes of page reload and all that
      localStorage.setItem("postAltid", JSON.stringify(issue));
      // fetch issues and recent posts pole pole
      setTimeout(() => {
        fetchRelatedIssues(uuid);
        fetchRecentPosts(uuid, issue, true);
      }, 2000);
    } else {
      Router.push("/posts");
    }

    // listen to load event, reload that is
    window.addEventListener("load", handleReload);
  }, []);
  // handle added comments  sent up from addcomments component
  const getValue = (data) => {
    dispatch(postactions.addComment(data));
  };

  return (
    <Layout title={post.clientName || "Post"}>
      {!reloading ? (
        <Grid container spacing={2} alignItems="flex-start" justify="center">
          <Grid item xs={false} md={3}>
            <Typography variant="h6">Recent issues</Typography>
            <RelatedIssues relatedissues={issues} sendRelated={getRelated} />
          </Grid>
          <Grid item className={classes.mainGrid} xs={12} md={6}>
            {" "}
            {post && "issue" in post ? (
              <>
                <PostDetails {...post} handleResolve={handleResolve} />
                <Comments
                  comments={comments}
                  sendValue={getValue}
                  post_id={post.id}
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
          <Grid item xs={false} md={3}>
            <Typography variant="h6">Recent posts</Typography>
            {recent.length ? (
              <RecentPosts recent={recent} sendRecent={getRecent} />
            ) : (
              <p>Loading recent posts</p>
            )}
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
    <Typography variant="h6"> {subject}</Typography>
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
        Added by {<b>{+handler_id === uuid ? "You" : addedBy} </b>} on {addedon}
      </small>
      <Typography>Status: {+status}</Typography>
    </Box>
    <Box>
      {/* Restriction */}
      {Number(handler_id) === uuid ? (
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

const RecentPosts = ({ recent, sendRecent }) => {
  return (
    <List align="left">
      {recent.map((post) => (
        <ListItem
          key={post.id}
          button
          divider
          selected
          className={post.selected ? "bg-danger text-white" : "bg-light"}
          align="right"
          onClick={() => sendRecent(post)}
        >
          <ListItemText primary={post.subject} secondary={post.clientName} />
        </ListItem>
      ))}
      <ListItem>
        <Link href="/posts">
          <a> Back to posts</a>
        </Link>
      </ListItem>
    </List>
  );
};

const RelatedIssues = ({ relatedissues, sendRelated }) => {
  return (
    <List align="left">
      {relatedissues.map((item, i) => (
        <ListItem
          key={i}
          button
          divider
          selected
          className={item.selected ? "bg-danger text-white" : "bg-light"}
          align="right"
          onClick={() => sendRelated(item.issue)}
        >
          <ListItemText primary={item.issue} />
          <Badge>{item.issuecount}</Badge>
        </ListItem>
      ))}
    </List>
  );
};
