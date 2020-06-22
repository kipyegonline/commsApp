import { C } from "./types";
const initState = {
  departments: [],
  error: false,
  errorMsg: "",
};
function departmentReducer(state = initState, action) {
  switch (action.type) {
    case C.ADD_DEPARTMENTS:
      return { ...state, departments: action.payload };
    case C.ADD_DEPARTMENT:
      return { ...state, departments: [...state.departments, action.payload] };
    case C.DELETE_DEPARTMENT:
      return {
        ...state,
        departments: state.departments.filter(
          (dept) => dept.id !== action.payload
        ),
      };
    case C.EDIT_DEPARTMENT:
      return state;
    default:
      return state;
  }
}
export default departmentReducer;
