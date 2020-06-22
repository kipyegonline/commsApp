import { combineReducers } from "redux";
import departmentReducer from "./departments/departmentReducer";

export default combineReducers({ departments: departmentReducer });
