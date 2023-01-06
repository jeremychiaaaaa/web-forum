import React, { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";
import LeftColumn from "./LeftColumn";
import ViewPost from "./Posts/ViewPost";
import AllPosts from "../styles/AllPosts";
import Header from "./Header";
import Login from "./Auth/Login";
import CreatePost from "./Posts/CreatePost";
import Register from "./Auth/Register";
import EditPost from "./Posts/EditPost";

import AllPostsPhone from "./Posts/Phone/AllPostsPhone";
import { Provider } from "react-redux";
import { Store } from "../redux/store";

import { Route, Routes, BrowserRouter } from "react-router-dom";

export const App = () => {
  // state to handle mobile display or not
  const [phone, setPhone] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  return (
    <Provider store={Store}>
      <div style={{ display: "flex", width: "100%", overflowX: "hidden" }}>
        {!phone && <LeftColumn />}
        <div
          style={{
            width: phone ? "100vw" : "85vw",
            display: "flex",
            flexDirection: "column",
            background: "rgba(220,220,220,0.2)",
            height: "100%",
          }}
        >
          <Header phone={phone} />
          <Routes>
            <Route
              path="/"
              element={phone ? <AllPostsPhone phone={phone} /> : <AllPosts />}
            />
            <Route path="/login" element={<Login phone={phone} />} />
            <Route path="/register" element={<Register phone={phone} />} />
            <Route path="/create-post" element={<CreatePost phone={phone} />} />
            <Route path="/edit/:post_id/:slug" element={<EditPost />} />
            <Route
              path="/post/:post_id/:slug"
              element={<ViewPost phone={phone} />}
            />
            <Route
              path="*"
              element={phone ? <AllPostsPhone phone={phone} /> : <AllPosts />}
            />{" "}
          </Routes>
        </div>
      </div>
    </Provider>
  );
};
