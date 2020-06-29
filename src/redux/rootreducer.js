import { combineReducers } from "redux";
import departmentReducer from "./departments/departmentReducer";
import usersReducer from "./usersReducer/usersReducer";

export default combineReducers({
  departments: departmentReducer,
  users: usersReducer,
});
