import { C } from "./types";

export const AddIssues = (payload) => ({ type: C.ADD_ISSUES, payload });
export const deleteIssues = (payload) => ({ type: C.DELETE_ISSUES, payload });
export const addIssue = (payload) => ({ type: C.ADD_ISSUE, payload });
export const addSelected = (payload) => ({ type: C.ADD_SELECTED, payload });
export const resetIssues = (payload) => ({ type: C.RESET_ISSUES, payload });
export const removeSelected = (payload) => ({
  type: C.REMOVE_SELECTED,
  payload,
});
export const addFetched = (payload) => ({ type: C.ADD_FETCHED, payload });
export const removeFetched = (payload) => ({ type: C.REMOVE_FETCHED, payload });
export const AddDeptissues = (payload) => ({ type: C.DEPT_ISSUES, payload });
export const getDeptIssues = (payload) => ({ type: C.ISSUE_DEPT, payload });
export const fetAll = () => ({ type: C.FETCH_ALL });
