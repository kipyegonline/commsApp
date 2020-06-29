import { C } from "./types";

const initState = {
  users: [],
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
    default:
      return state;
  }
}
export default usersReducer;
