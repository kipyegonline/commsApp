import { C } from "./types";
/* users Reducers */
export const addUser = (payload) => ({ type: C.ADD_USERS, payload });
export const addOneUser = (payload) => ({ type: C.ADD_USER, payload });
export const editUser = (payload) => ({ type: C.EDIT_USER, payload });
export const deleteUser = (payload) => ({ type: C.DELETE_USER, payload });
export const editSelected = (payload) => ({ type: C.SELECTED_USER, payload });
export const addsection = (payload) => ({ type: C.SECTION_USERS, payload });
export const addsearched = (payload) => ({ type: C.SEARCHED_USERS, payload });
export const addselectedUsers = (payload) => ({
  type: C.ADD_SELECTED_USERS,
  payload,
});
export const removeselectedUsers = (payload) => ({
  type: C.UNSELECTED_USER,
  payload,
});
export const removeSelectedUsers = (payload) => ({
  type: C.DELETE_SELECTED_USERS,
  payload,
});
export const resetSelected = (payload) => ({
  type: C.RESET_SELECTED_USERS,
  payload,
});

export const addUserdept = (payload) => ({
  type: C.USER_DEPTS,
  payload,
});

export const setTableUsers = (payload) => ({ type: C.USER_STATS, payload });
export const addError = (payload) => ({ type: C.ADD_ERRORS, payload });
