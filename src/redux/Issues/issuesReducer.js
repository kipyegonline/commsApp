import { C } from "./types";

const initState = {
  issues: [],
  fetched: [],
  deptIssues: [],
};

function issuesReducer(state = initState, action) {
  switch (action.type) {
    case C.ADD_ISSUES:
      return { ...state, issues: action.payload };
    case C.ADD_ISSUE:
      //check if same thing exists
      let check = state.issues.find(
        (issue) => issue.issue === action.payload.issue
      );

      if (check) {
        return state;
      }
      return { ...state, issues: [...state.issues, action.payload] };
    case C.DELETE_ISSUES:
      return {
        ...state,
        issues: state.issues.filter((issue) => issue.altId !== action.payload),
      };
    case C.ADD_SELECTED:
      return {
        ...state,
        fetched: state.fetched.map((item) =>
          item.id === action.payload ? { ...item, selected: true } : item
        ),
      };

    case C.REMOVE_SELECTED:
      return {
        ...state,
        fetched: state.fetched.map((item) =>
          item.id === action.payload ? { ...item, selected: false } : item
        ),
      };
    case C.ADD_FETCHED:
      return {
        ...state,
        fetched: [...state.fetched, ...action.payload],
      };
    case C.REMOVE_FETCHED:
      return {
        ...state,
        fetched: state.fetched.filter(
          (item) => item.userdept !== action.payload
        ),
      };
    case C.RESET_ISSUES:
      return {
        ...state,
        fetched: [],
      };
    case C.DEPT_ISSUES:
      return { ...state, deptIssues: action.payload };
    default:
      return state;
  }
}
export default issuesReducer;
