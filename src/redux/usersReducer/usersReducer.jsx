import { C } from "./types";

const initState = {
  users: [],
  user: {},
  selectedUsers: [],
  userdepts: [],
  userStats: [],
  sectionUsers: [],
  department: "",
  errors: "",
};
function usersReducer(state = initState, action) {
  switch (action.type) {
    case C.ADD_USERS:
      return {
        ...state,
        users: action.payload,
        sectionUsers: action.payload,
        department: "",
      };
    case C.ADD_USER:
      const userExists = state.users.find(
        (user) => user.userAltId === action.payload
      );
      return userExists
        ? {
            ...state,
            user: userExists,
          }
        : state;
    case C.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        sectionUsers: state.sectionUsers.filter(
          (user) => user.id !== action.payload
        ),
      };
    case C.SECTION_USERS:
      const checkdept = state.users.find(
        (user) => user.userdept === action.payload
      );
      return {
        ...state,
        sectionUsers: state.users.filter(
          (user) => +user.userdept === action.payload
        ),
        department: checkdept ? checkdept.userdept : "",
        userStats: state.userStats.map((stat) =>
          stat.id === action.payload
            ? { ...stat, clicked: true }
            : { ...stat, clicked: false }
        ),
      };
    case C.SEARCHED_USERS:
      return {
        ...state,
        sectionUsers: action.payload,
        department: "",
      };
    case C.EDIT_USER:
      const id = state.users.find((user) => user.id === action.payload.id);
      if (id) {
        const newState = state.users.map((user) =>
          user.id === action.payload.id ? { ...action.payload } : { ...user }
        );
        return {
          ...state,
          users: newState,
          user: action.payload,
          sectionUsers: newState,
        };
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
    case C.USER_STATS:
      return {
        ...state,
        userStats: action.payload,
      };
    case C.ADD_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };

    default:
      return state;
  }
}
export default usersReducer;
