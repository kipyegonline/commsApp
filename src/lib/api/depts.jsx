import axios from "axios";
import * as actions from "../../redux/departments/actions";

async function FetchDepts(url, dispatch) {
  try {
    const res = await axios.get(url);

    if (res?.data?.length || Array.isArray(res.data)) {
      dispatch(actions.addDepts);
    } else {
      throw new Error("No data found...");
    }
  } catch (error) {
    dispatch(actions.setErr(error.message));
  }

  /** // remove this during production
    dispatch(actions.addDepts(getLocal("depts"))) */
}
export default FetchDepts;
