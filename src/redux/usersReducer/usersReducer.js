import { C } from "./types";

const initState = {
  users: [],
  selectedUsers: [],
  userdepts: [],
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
    case C.SELECTED_USER: // add post
      return {
        ...state,
        selectedUsers: state.selectedUsers.map((user) => {
          if (user.id === action.payload) {
            return { ...user, selected: !user.selected };
          }
          return user;
        }),
      };

    case C.ADD_SELECTED_USERS:
      // if the user department already exists

      const alreadySelected = state.selectedUsers.some(
        (user) => user.userdept === action.payload[0].userdept
      );
      if (!alreadySelected) {
        return {
          ...state,
          selectedUsers: [...action.payload, ...state.selectedUsers],
        };
      }
      return state;

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

        selectedUsers: [],
      };
    case C.USER_DEPTS:
      return { ...state, userdepts: action.payload };
    default:
      return state;
  }
}
export default usersReducer;
