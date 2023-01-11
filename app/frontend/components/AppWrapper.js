import React from "react";
import { Provider } from "react-redux";
import { Store } from "../redux/store";
import { App } from "./App";

const AppWrapper = () => {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
