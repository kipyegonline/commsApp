import { C } from "./types";

const initState = {
  users: [],
  selectedUsers: [],
};
function usersReducer(state = initState, action) {
  switch (action.type) {
    case C.ADD_USERS:
      return { ...state, users: action.payload };
    case C.DELETE_USER:
      return {
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case C.EDIT_USER:
      const id = state.users.findIndex((user) => user.id === action.payload.id);
      if (id) {
        state.users[id] = action.payload;
        return state;
      }
      return state;
    case C.SELECTED_USER:
      return {
        ...state,
        selectedUsers: state.selectedUsers.map((user) =>
          user.altId === action.payload
            ? { ...user, selected: !user.selected }
            : { ...user }
        ),
      };
    case C.ADD_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: [...action.payload, ...state.selectedUsers],
      };
    case C.DELETE_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: state.selectedUsers.filter(
          (user) => user.userdept !== action.payload
        ),
      };
    case C.RESET_SELECTED_USERS:
      return {
        ...state,
        users: state.users.map((user) => ({ ...user, selected: false })),
        selectedUsers: [],
      };
    default:
      return state;
  }
}
export default usersReducer;
