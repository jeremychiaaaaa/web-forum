import React, { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";
import LeftColumn from "./LeftColumn";
import ViewPost from "./Posts/ViewPost";
import AllPosts from "./Posts/AllPosts";
import Header from "./Header";
import Login from "./Auth/Login";
import CreatePost from "./Posts/CreatePost";
import Register from "./Auth/Register";
import EditPost from "./Posts/EditPost";

import AllPostsPhone from "./Posts/Phone/AllPostsPhone";
import { Provider, useDispatch } from "react-redux";
import { Store } from "../redux/store";
import {
  setUserID,
  setUserLikedPost,
  setUsername,
  setUserPic,
  setUserPost,
  setUserLikedComments,
} from "../redux/actions";

import { Route, Routes, BrowserRouter } from "react-router-dom";

export const App = () => {
  const dispatch = useDispatch();

  // state to handle mobile display or not
  const [phone, setPhone] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  //state to handle tablet display or not
  const [tablet, setTablet] = useState(
    window.matchMedia("(min-width:768px) and (max-width: 1024px)").matches
  );

  // state to handle number of posts to conditionally render height of parent container
  const [numOfPosts, setNumOfPosts] = useState(0);

  // whenever a user refreshes a page, load the user specific content if user previously signed in
  useEffect(() => {
    axios
      .get("/api/v1/sessions/logged_in", { withCredentials: true })
      .then((res) => {
        if (res.data.data) {
          // this means that user has already logged in previously

          // dispatch user details to redux store
          dispatch(setUserID(res.data.data.id));
          dispatch(setUsername(res.data.data.attributes.username));
          dispatch(setUserPic(res.data.data.attributes.profile_url));

          let temp = res.data.included;

          // get posts that the user has liked

          let liked_posts = temp
            .map((item) => {
              if (item.type === "like") {
                return {
                  post_id: item.attributes.post_id,
                  like_id: item.id,
                };
              }
            })
            .filter((item) => item !== undefined);

          // get posts that belongs to a specific user to allow delete and edit functionality

          let userPost = temp
            .map((item) => {
              if (item.type === "post") {
                return item.id;
              }
            })
            .filter((item) => item !== undefined);
          let liked_comment = temp
            .map((item) => {
              if (item.type === "like_comment") {
                return {
                  comment_id: item.attributes.comment_id,
                  like_comment_id: item.id,
                };
              }
            })
            .filter((item) => item !== undefined);

          dispatch(setUserLikedPost(liked_posts));
          dispatch(setUserPost(userPost));
          dispatch(setUserLikedComments(liked_comment));
        }
      })
      .catch((res) => console.log(res));
  }, []);

  return (
    <>
      <div style={{ display: "flex", width: "100%", overflowX: "hidden" }}>
        {!phone && <LeftColumn tablet={tablet} />}
        <div
          style={{
            width: phone ? "100vw" : tablet ? "65vw" : "80vw",
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
              element={
                phone ? (
                  <AllPostsPhone phone={phone} />
                ) : (
                  <AllPosts numOfPosts={numOfPosts} />
                )
              }
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
    </>
  );
};
