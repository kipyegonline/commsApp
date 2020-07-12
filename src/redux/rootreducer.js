import { combineReducers } from "redux";
import departmentReducer from "./departments/departmentReducer";
import usersReducer from "./usersReducer/usersReducer";
import issuesReducer from "./Issues/issuesReducer";

export default combineReducers({
  departments: departmentReducer,
  users: usersReducer,
  issues: issuesReducer,
});
