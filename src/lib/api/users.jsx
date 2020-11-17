import axios from "axios";

import * as useractions from "../../redux/usersReducer/actions";
import * as deptactions from "../../redux/departments/actions";
import { getLocal, handleLocalStorage } from "../../components/helpers";

export const fetchData = async (url) => {
  try {
    const res = await axios.get(url);
    if (res.statusText) {
      const { data } = res;
      return data;
    }
  } catch (error) {
    dispatch(useractions.addError(error.message));
  }
};
export const fetchStats = (url, dispatch) => {
  axios
    .get(url)
    .then((res) => {
      if (!res.data.length || !Array.isArray(res.data))
        throw new Error("No data found");

      const stats = res.data.map((item) => ({ ...item, clicked: false }));
      dispatch(useractions.setTableUsers(stats));
    })
    .catch((error) => dispatch(useractions.addError(error.message)));
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
  } else {
    // fetch added user
    fetchData("/users/fetchusers").then((res) =>
      dispatch(useractions.addUser(res))
    );
  }
};
// get selected dept
export const getSelected = (e = 1, dispatch) => {
  const id = e.target === undefined ? e : +e.target.value;

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
      if (!res?.data.length || !Array.isArray(res.data)) {
        throw new Error("No data found...");
      } else {
        dispatch(useractions.addsearched(res.data));
      }
    })
    .catch((error) => dispatch(useractions.addError(error.message)));
};
