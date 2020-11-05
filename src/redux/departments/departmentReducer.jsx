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
      /// fix this part
      return state;
    case C.SELECTED_DEPT:
      return {
        ...state,
        departments: state.departments.map((dept) =>
          dept.id === action.payload
            ? { ...dept, selected: !dept.selected }
            : { ...dept }
        ),
      };
    case C.ISSUE_SELECTED:
      return {
        ...state,
        departments: state.departments.map((dept) =>
          dept.id === action.payload
            ? { ...dept, selected: true }
            : { ...dept, selected: false }
        ),
      };

    case C.RESET_SELECTED_DEPT:
      return {
        ...state,
        departments: state.departments.map((dept) => ({
          ...dept,
          selected: false,
        })),
      };
    default:
      return state;
  }
}
export default departmentReducer;