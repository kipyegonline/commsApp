import { C } from "./types";

export const AddIssues = (payload) => ({ type: C.ADD_ISSUES, payload });
export const deleteIssues = (payload) => ({ type: C.DELETE_ISSUES, payload });
export const addIssue = (payload) => ({ type: C.ADD_ISSUE, payload });
export const addSelected = (payload) => ({ type: C.ADD_SELECTED, payload });
export const removeSelected = (payload) => ({
  type: C.REMOVE_SELECTED,
  payload,
});
export const addFetched = (payload) => ({ type: C.ADD_FETCHED, payload });
export const removeFetched = (payload) => ({ type: C.REMOVE_FETCHED, payload });
