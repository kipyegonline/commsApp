import { C } from "./types";

const initState = {
  posts: [],
  post: {},
  selectedUsers: [],
};

function postsReducer(state = initState, action) {
  switch (action.type) {
    case C.ADD_POSTS:
      return { ...state, posts: action.payload };

    case C.SET_TICKS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload ? { ...post, seen: true } : { ...post }
        ),
      };
    default:
      return state;
  }
}
export default postsReducer;
