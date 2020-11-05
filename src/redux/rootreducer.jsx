import { combineReducers } from "redux";
import departmentReducer from "./departments/departmentReducer";
import usersReducer from "./usersReducer/usersReducer";
import issuesReducer from "./Issues/issuesReducer";
import postsReducer from "./posts/postsReducer";

export default combineReducers({
  departments: departmentReducer,
  users: usersReducer,
  issues: issuesReducer,
  posts: postsReducer,
});
