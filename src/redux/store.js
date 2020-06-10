import { createStore } from "redux";
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
const rootReducer = (state = { jules: {} }, action) => state;
const store = createStore(rootReducer, devtools());
export default store;
