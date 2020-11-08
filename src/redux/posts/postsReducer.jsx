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
    case C.RECENT_CLICKED:
      return {
        ...state,
        post: action.payload,
        recentPosts: state.recentPosts.map((post) =>
          post.id === action.payload.id
            ? { ...post, selected: true }
            : { ...post, selected: false }
        ),
      };
    case C.RESOLVE_ISSUE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.altId === action.payload.altId
            ? { ...post, status: action.payload.status }
            : { ...post }
        ),
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
    case C.EDITED_COMMENT:
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.altId === action.payload.id
            ? {
                ...comment,
                comment: action.payload.edit,
                addedEn: new Date().toLocaleString(),
              }
            : { ...comment }
        ),
      };

    default:
      return state;
  }
}
export default postsReducer;
