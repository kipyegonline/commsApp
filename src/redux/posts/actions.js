import { C } from "./types";

export const addPosts = (payload) => ({ type: C.ADD_POSTS, payload });

export const setTicks = (payload) => {
  return { type: C.SET_TICKS, payload };
};
