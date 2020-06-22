import { C } from "./types";

export const addDepts = (payload) => ({ type: C.ADD_DEPARTMENTS, payload });
export const addDept = (payload) => ({ type: C.ADD_DEPARTMENT, payload });
export const deleteDept = (payload) => ({ type: C.DELETE_DEPARTMENT, payload });
export const editDept = (payload) => ({ type: C.EDIT_DEPARTMENT, payload });
