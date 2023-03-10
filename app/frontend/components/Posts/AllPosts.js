import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { IoMdAdd } from "react-icons/io";
import { HiSearch } from "react-icons/hi";
import Post from "./Post";
import { useSelector, useDispatch } from "react-redux";
import { MagnifyingGlass } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

import {
  setUserID,
  setUserLikedPost,
  setUsername,
  setUserPic,
  setSuccessfulEdit,
  setUserPost,
} from "../../redux/actions";
//moment here is the package to help convert the created_at timestamp from the rails backend to a relative time in words

import Moment from "react-moment";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 70px;
  gap: 25px;
  width: 100%;
  height: 100%;
  position: relative;
`;
const Header = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
`;

const Posts = styled.div`
  width: 80%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
`;

const NoPosts = styled.div`
  width: 100%;
  margin: 0px auto;
  font-family: Poppins;
`;

const AllPosts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //category choose from left column passed own by redux

  const {
    category,
    username,
    user_id,
    edit,
    userLikedPost,
    userLogOut,
    userPosts,
  } = useSelector((state) => state.userReducer);

  // state to handle category user chooses where defaults to latest
  const [topHeaderCategory, setTopHeaderCategory] = useState("Latest");

  //state to handle when to load the spinner

  const [loader, setLoader] = useState(false);

  //state to handle posts from database
  const [posts, setPosts] = useState([]);

  // state to handle when user likes and unlike to update the rendered screen with latest data from api
  const [userLikeAction, setUserLikeAction] = useState(false);

  // state to handle active search bar or not
  const [searchBarActive, setSearchBarActive] = useState(false);

  // state to handle search bar errors such as no posts found related to search input
  const [searchBarError, setSearchBarError] = useState("");

  const [individualPostLikesData, setIndividualPostLikesData] = useState([]);

  useEffect(() => {
    // check if user has previously logged in and already stored in cookies then automatically log him in

    setLoader(true);

    //conditionally load posts displayed based on category choose. Loader form react-spinner will be used as data is fetched in between fetch requests

    if (category === "All") {
      fetch("/api/v1/posts.json")
        .then((res) => {
          //this is to get all the posts from the database

          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Network error");
          }
        })
        .then((res) => {
          setPosts(res.data);

          setLoader(false);
          setUserLikeAction(false);
        })
        .catch((res) => console.log(res));
    } else {
      axios
        .get(`/api/v1/posts/category/${category}`)
        .then((res) => {
          //this is to get all the posts from the database
          setLoader(false);
          setPosts(res.data.data);

          //this is to get all the likes who posted the individual posts

          setUserLikeAction(false);
        })
        .catch((res) => console.log(res));
    }
  }, [category, userLikeAction, userLogOut,topHeaderCategory]);
  console.log(category)
  // when user clicks on add post, need to check if the user has already logged in.
  const addPost = () => {
    if (username !== "") {
      navigate("/create-post");
    } else {
      navigate("/login");
    }
  };

  //form the combined array of posts,comments,likes

  let final = posts.map((post, index) => {
    return {
      id: post.id,
      created_at: post.attributes.created_at,
      title: post.attributes.title,
      description: post.attributes.description,
      image_url: post.attributes.image_url,

      username: post.attributes.username,
      category_name: post.attributes.category_name,
      comments: post.relationships.comments,
      likes: post.relationships.likes,
      slug: post.attributes.slug,
      userId: post.relationships.user.data?.id,
    };
  });

  const individualPost = final.map((item, index) => {
    return (
      <Post
        created_at={item.created_at}
        category_name={item.category_name}
        description={item.description}
        image_url={item.image_url}
        title={item.title}
        users={item.username}
        likes={item.likes}
        comments={item.comments}
        post_id={item.id}
        slug={item.slug}
        topHeaderCategory={topHeaderCategory}
        userId={item.userId}
        setLoader={setLoader}
      />
    );
  });

  // arrange individual post by popularity

  const individualPostsByPopularity = final
    .sort((a, b) => b.likes.data.length - a.likes.data.length)
    .map((item, index) => {
      return (
        <Post
          created_at={item.created_at}
          category_name={item.category_name}
          description={item.description}
          image_url={item.image_url}
          title={item.title}
          users={item.username}
          post_id={item.id}
          likes={item.likes}
          comments={item.comments}
          slug={item.slug}
          topHeaderCategory={topHeaderCategory}
          userId={item.userId}
          setLoader={setLoader}
        />
      );
    });

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", gap: 40 }}>
          <span
            style={{
              fontSize: "1.5rem",
              paddingBottom: 5,
              fontWeight: 600,
              borderBottom:
                topHeaderCategory === "Latest" ? "3px solid #ff7f50" : "none",
              fontFamily: "Poppins",
              cursor: "pointer",
              color:
                topHeaderCategory === "Latest"
                  ? "black"
                  : "rgba(220,220,220,1)",
            }}
            onClick={() => setTopHeaderCategory("Latest")}
          >
            Latest
          </span>

          <span
            style={{
              fontSize: "1.5rem",
              paddingBottom: 5,
              fontWeight: 600,
              borderBottom:
                topHeaderCategory === "Popular" ? "3px solid #ff7f50" : "none",
              fontFamily: "Poppins",
              cursor: "pointer",
              color:
                topHeaderCategory === "Popular"
                  ? "black"
                  : "rgba(220,220,220,1)",
            }}
            onClick={() => setTopHeaderCategory("Popular")}
          >
            Popular
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <SearchBar
            searchBarActive={searchBarActive}
            setSearchBarActive={setSearchBarActive}
            posts={posts}
            setPosts={setPosts}
            searchBarError={searchBarError}
            setSearchBarError={setSearchBarError}
          />
          <IoMdAdd
            onClick={addPost}
            style={{
              padding: 15,
              borderRadius: 5,
              background: "#ff7f50",
              color: "white",
              cursor: "pointer",
              transform: "translateX(30px)",
            }}
          />
        </div>
      </Header>

      {/*If loader true, display spinner else display posts */}

      {loader ? (
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="MagnifyingGlass-loading"
          wrapperStyle={{}}
          wrapperClass="MagnifyingGlass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      ) : posts.length === 0 ? (
        <NoPosts>
          Unfortunately no posts related to{" "}
          {searchBarError === "" ? category : searchBarError}...
        </NoPosts>
      ) : topHeaderCategory === "Popular" ? (
        <Posts>{individualPostsByPopularity}</Posts>
      ) : (
        <Posts>{individualPost}</Posts>
      )}
    </Container>
  );
};

export default AllPosts;
