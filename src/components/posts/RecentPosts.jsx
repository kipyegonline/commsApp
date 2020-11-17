import React, { memo } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import Link from "next/link";

const RecentPosts = ({ recent = [], sendRecent = (f) => f }) => {
  return (
    <List align="left">
      {recent.map((post) => (
        <RecentPost key={post.id} post={post} sendRecent={sendRecent} />
      ))}
      <ListItem>
        <Link href="/posts">
          <a> Back to posts</a>
        </Link>
      </ListItem>
    </List>
  );
};

const RecentPost = ({ post = {}, sendRecent = (f) => f }) => (
  <ListItem
    button
    divider
    selected
    className={post.selected ? "bg-danger text-white" : "bg-light"}
    align="right"
    onClick={() => sendRecent(post)}
  >
    <ListItemText primary={post.subject} secondary={post.clientName} />
  </ListItem>
);
export default RecentPosts;
