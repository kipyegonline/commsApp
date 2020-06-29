import { C } from "./types";
/*users Reducers*/
export const addUser = (payload) => ({ type: C.ADD_USERS, payload });
export const editUser = (payload) => ({ type: C.EDIT_USER, payload });
export const deleteUser = (payload) => ({ type: C.DELETE_USER, payload });
