import { createStore } from "redux";
import rootReducer from "./rootreducer";
const devtools = () => {
  let window = globalThis;
  if (window) {
    let tools = window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f;
    return tools;
  } else {
    return null;
  }
};

const store = createStore(rootReducer, devtools());
export default store;
