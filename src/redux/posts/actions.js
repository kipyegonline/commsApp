import { C } from "./types";

export const addPosts = (payload) => ({ type: C.ADD_POSTS, payload });
export const addPost = (payload) => ({ type: C.ADD_POST, payload });
export const setTicks = (payload) => {
  return { type: C.SET_TICKS, payload };
};

export const getPost = (payload) => ({ type: C.GET_POST, payload });
export const addComment = (payload) => ({ type: C.ADD_COMMENT, payload });
export const deleteComment = (payload) => ({ type: C.DELETE_COMMENT, payload });
export const addComments = (payload) => ({ type: C.ADD_COMMENTS, payload });
export const addrecentposts = (payload) => ({
  type: C.ADD_RECENT_POSTS,
  payload,
});
