import { C } from "./types";

export const AddIssues = (payload) => ({ type: C.ADD_ISSUES, payload });
export const deleteIssues = (payload) => ({ type: C.DELETE_ISSUES, payload });
export const addIssue = (payload) => ({ type: C.ADD_ISSUE, payload });
