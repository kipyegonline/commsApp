import { C } from "./types";

const initState = {
  issues: [],
  selectedIssues: [],
  fetched: [],
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
      let added = state.selectedIssues.some(
        (item) => item.id === action.payload.id
      );

      if (!added) {
        return {
          ...state,
          selectedIssues: [...state.selectedIssues, action.payload],
        };
      }
      return state;

    case C.REMOVE_SELECTED:
      return {
        ...state,
        selectedIssues: state.selectedIssues.filter(
          (issue) => issue.id !== action.payload
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
        selectedIssues: state.selectedIssues.filter(
          (item) => item.userdept !== action.payload
        ),
      };
    default:
      return state;
  }
}
export default issuesReducer;
