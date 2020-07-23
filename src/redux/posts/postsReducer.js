import { C } from "./types";

const initState = {
  posts: [],
  post: {},
  selectedUsers: [],
  comments: [],
  recentPosts: [],
};

function postsReducer(state = initState, action) {
  switch (action.type) {
    case C.ADD_POSTS:
      return { ...state, posts: action.payload };
    case C.ADD_POST:
      return { ...state, post: action.payload };

    case C.ADD_RECENT_POSTS:
      return { ...state, recentPosts: action.payload };

    case C.SET_TICKS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload ? { ...post, seen: true } : { ...post }
        ),
      };
    case C.GET_POST:
      return {
        ...state,
        post: state.posts.find((post) => post.altId === action.payload),
      };
    case C.ADD_COMMENTS:
      return {
        ...state,
        comments: action.payload,
      };
    case C.ADD_COMMENT:
      return {
        ...state,
        comments: [action.payload, ...state.comments],
      };

    case C.DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment.altId !== action.payload
        ),
      };
    default:
      return state;
  }
}
export default postsReducer;
