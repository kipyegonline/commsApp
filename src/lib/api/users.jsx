import axios from "axios";

import * as useractions from "../../redux/usersReducer/actions";
import * as deptactions from "../../redux/departments/actions";
import { getLocal, handleLocalStorage } from "../../components/helpers";

export const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (res.statusText) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    return [];
  }
};
export const fetchStats = (url, dispatch) => {
  axios
    .get(url)
    .then((res) => {
      res.map((item) => ({ ...item, clicked: false }));
      dispatch(useractions.setTableUsers(res.data));
    })
    .catch((error) => console.log("stats err", error));
};

export const deleteUser = (id, dispatch) => {
  dispatch(useractions.deleteUser(id));
  fetch(`/users/deleteuser?q=${id}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
};

export const editUser = (data, status, dispatch) => {
  if (status === true) {
    dispatch(useractions.editUser(data));
    console.log("editing user");
  } else {
    console.log("new user added");
    // fetch added user
    fetchData("/users/fetchusers").then((res) =>
      dispatch(useractions.addUser(res))
    );
  }
};
// get selected dept
export const getSelected = (e = 1, dispatch) => {
  const id = +e.target.value;

  if (id < 1) return;
  dispatch(useractions.addsection(id));
};

export const fetchLocalData = (dispatch) => {
  // remove on prod
  dispatch(
    useractions.addUser(
      getLocal("users").map((item) => ({
        ...item,
        selected: false,
      }))
    )
  );
  dispatch(
    deptactions.addDepts(
      getLocal("depts").map((item) => ({
        ...item,
        selected: false,
      }))
    )
  );
};

export const fetchSearch = (text, dispatch) => {
  axios
    .get(`/users/getdeptsearch?q=${text}`)
    .then((res) => {
      if (res.data) {
        dispatch(useractions.addsearched(res.data));
      } else {
        dispatch(useractions.addsearched([]));
      }
    })
    .catch((error) => console.log(error));
};

export const useAuth = () =>
  globalThis.Window && JSON.parse(localStorage.getItem("commsApp"));
export const removeAuth = () => localStorage.removeItem("commsApp");
