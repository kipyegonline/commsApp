import React from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
import Notifications from "@material-ui/icons/NotificationImportant";
import Skeleton from "@material-ui/lab/Skeleton";
import * as postactions from "../../redux/posts/actions";
import Comments from "../../components/posts/comments";
import Layout from "../../components/Layout";
import PostDetails from "../../components/posts/PostDetails";
import RecentPosts from "../../components/posts/RecentPosts";
import RelatedIssues from "../../components/posts/RelatedIssues";

const useStyles = makeStyles({
  grid: {
    padding: "1rem",
    margin: ".25rem",
    background: "#fefefe",
  },
  mainGrid: {
    width: "58%",
    background: "beige",
    marginTop: 10,
  },
});
// mock auth
const { uuid, userdept } = { uuid: 20, userdept: 5 };

const Post = () => {
  const [reloading, setReloading] = React.useState(false);
  const [related, setRelated] = React.useState([]);
  const [relatedspin, setRelatedSpin] = React.useState(true);
  const [recentspin, setRecentpin] = React.useState(true);

  const classes = useStyles();
  const dispatch = useDispatch();
  // get the clicked item from router props
  const {
    query: { id: issue },
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
      .get(`/posts/fetchpost/${postId}/${userId}`)
      .then((res) => {
        if (!res.data.length || !Array.isArray(res.data)) {
          throw new Error("No payload attached");
        }
        dispatch(postactions.addPost(res.data[0]));
      })
      .catch((error) => console.error("fetch post:", error))
      .finally(() => setReloading(false));
  };
  // fetch post comments
  const fetchComments = (userId, postId) => {
    axios
      .get(`/posts/fetchcomments/${postId}/${userId}`)
      .then((res) => {
        if (!res.data.length || !Array.isArray(res.data)) {
          throw new Error("No payload attached");
        }

        dispatch(postactions.addComments(res.data));
      })
      .catch((error) => console.error("fetch comments:", error));
  };
  // fetch issues

  const fetchRelatedIssues = (uuid) => {
    axios
      .get(`/posts/fetchRelatedIssues/${uuid}/${issue}`)
      .then((res) => {
        if (res.data) {
          if (res.data.length)
            return res.data.map((item) => ({ ...item, selected: false }));
        }
        throw new Error("No payload attached");
      })
      .then((res) => setRelated(res))
      .catch((error) => console.error("fetch issues:", error))
      .finally(() => setRelatedSpin(false));
  };

  // fetch 5 recent posts minus the one under review

  const fetchRecentPosts = (userId, issue, recent) => {
    axios
      .get(`/posts/fetchrecentposts/${issue}/${userId}/`)
      .then((res) => {
        if (res.data) {
          if (res.data.length)
            return res.data.map((item) => ({ ...item, selected: false }));
        }

        throw new Error("No payload attached");
      })
      .then((res) => dispatch(postactions.addrecentposts(res)))

      .catch((error) => console.error("fetch recent posts:", error))
      .finally(() => setRecentpin(false));
  };

  // when recents stats is clicked

  const fetchPostsForRecent = (uuid, issue) => {
    setRecentpin(true);
    axios
      .get(`/posts/fetchpostsrecents/${issue}/${uuid}/`)
      .then((res) => {
        if (res.data) {
          if (res.data.length)
            return res.data.map((item) => ({ ...item, selected: false }));
        }

        throw new Error("No payload attached");
      })
      .then((res) => dispatch(postactions.addrecentposts(res)))

      .catch((error) => console.error("fetch recent posts:", error))
      .finally(() => setRecentpin(false));
  };
  // handle page reload
  const handleReload = () => {
    setReloading(true);

    const postAltid = JSON.parse(localStorage.getItem("postAltid"));
    Promise.all([
      fetchPost(uuid, postAltid),
      fetchComments(postAltid),
    ]).finally(() => setReloading(false));

    // pole pole
    setTimeout(() => {
      fetchRelatedIssues(uuid);
      fetchRecentPosts(uuid, issue, true);
    }, 3000);
  };
  // when a recent post is clicked
  const getRecent = (clickedpost) => {
    dispatch(postactions.recentClicked(clickedpost));
    fetchComments(uuid, clickedpost.altId);
  };
  const getRelated = (issue, id) => {
    const issues = related.map((item) =>
      item.issue === issue
        ? { ...item, selected: true }
        : { ...item, slected: false }
    );
    console.log(issue, id, "recentponts");
    setRelated(issues);
    fetchPostsForRecent(uuid, id);
  };

  const handleResolve = (current, newstatus) => {
    if (current === newstatus) return;
    dispatch(postactions.resolveIssue({ newstatus, altId: issue }));
    axios
      .get(`/posts/resolveissue/${issue}/${uuid}?status=${newstatus}`)
      .then((res) => {
        const { data } = res;
        if (data.status === 2) fetchRecentPosts(uuid, issue, false);
      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    // if the post id is already on router params
    if (issue) {
      // Get clicked post since its already on redux store
      dispatch(postactions.getPost(issue));
      // fetch posts comments,if any
      fetchComments(uuid, issue);
      // store key on  local storage for purposes of page reload and all that
      localStorage.setItem("postAltid", JSON.stringify(issue));

      // fetch issues and recent posts pole pole if they dont already exist
      if (!recent.length || !related.length) {
        setTimeout(() => {
          Promise.all([
            fetchRelatedIssues(uuid),
            fetchRecentPosts(uuid, issue, true),
          ]);
        }, 3000);
      }
    } else {
      // setReloading(true);
      // Router.push("/posts");
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
            {/* eslint-disable no-nested-ternary */}
            {relatedspin ? (
              <div className="text-center mx-auto my-3 p-4">
                <CircularProgress size="1rem" color="primary" />
                <Typography>Fetching summary</Typography>
              </div>
            ) : related.length ? (
              <div>
                <Typography variant="h6">Recent issues</Typography>
                <RelatedIssues
                  relatedissues={related}
                  sendRelated={getRelated}
                />
              </div>
            ) : (
              <Typography>No details found</Typography>
            )}
          </Grid>
          <Grid item className={classes.mainGrid} xs={12} md={6}>
            {" "}
            {post && "issue" in post ? (
              <div>
                <PostDetails {...post} handleResolve={handleResolve} />

                <Comments
                  comments={comments}
                  sendValue={getValue}
                  post_id={post.id}
                  handler_id={post.handler_id}
                />
              </div>
            ) : (
              <Box className="m-4 text-center">
                <CircularProgress color="primary" size="3rem" />
                <p>Reloading post</p>
              </Box>
            )}
          </Grid>
          <Grid item xs={false} md={3}>
            {recentspin ? (
              <div className="text-center mx-auto my-3 p-4">
                <CircularProgress size="3rem" color="primary" />
                <Typography>Fetching recent posts</Typography>
              </div>
            ) : recent.length ? (
              <div>
                <Typography variant="h6">Recent posts</Typography>
                <RecentPosts recent={recent} sendRecent={getRecent} />{" "}
              </div>
            ) : (
              <Typography>You have no recent posts</Typography>
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
