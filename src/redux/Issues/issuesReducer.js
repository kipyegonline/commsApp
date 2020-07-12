import { C } from "./types";

const initState = {
  issues: [],
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
    default:
      return state;
  }
}
export default issuesReducer;
