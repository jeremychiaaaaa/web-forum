import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { BiCategory } from "react-icons/bi";
import { BsFilterRight } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import {
  setAllCategories,
  setUserID,
  setUsername,
  setUserPic,
  setUserLikedPost,
} from "../../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { MagnifyingGlass } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../SearchBar/SearchBar";
import PhoneDropDown from "../Dropdown/PhoneDropDown";
import Post from "../Post";
// majority of the states are copied from the desktop version of all posts file

const Container = styled.div`
  display: flex;
  flex-direction: column;

  gap: 35px;
  width: 100%;
  height: 100vh;
  position: relative;
`;
const Header = styled.div`
  width: 90%;
  align-self: center;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
`;

const Posts = styled.div`
  width: 95%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: center;
`;

const NoPosts = styled.div`
  width: 90%;
  margin: 0px auto;
  font-family: Poppins;
`;

const AllPostsPhone = ({ phone }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allCategories, category, username } = useSelector(
    (state) => state.userReducer
  );
  const [posts, setPosts] = useState([]);
  const [allCats, setAllCats] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);
  // state to handle category user chooses where defaults to latest

  const [topHeaderCategory, setTopHeaderCategory] = useState("Latest");

  // state to handle when user likes and unlike to update the rendered screen with latest data from api

  const [userLikeAction, setUserLikeAction] = useState(false);

  // state to get all the post ids that the user has liked to handle between a red heart icon and a transparent heart icon for each post component

  const [userLikedPosts, setUserLikedPosts] = useState([]);

  const [userPosts, setUserPosts] = useState([]);

  // state to handle search bar errors such as no posts found related to search input

  const [searchBarError, setSearchBarError] = useState("");

  // state to handle already return of previously logged in users

  const [returningUsers, setReturningUsers] = useState(false);

  useEffect(() => {
    setLoader(true);

    // get all categories from database

    axios.get("/api/v1/categories").then((res) => {
      setAllCats(res.data.data);
    });

    // check if user has previously logged in and already stored in cookies then automatically log him in

    axios
      .get("/api/v1/sessions/logged_in", { withCredentials: true })
      .then((res) => {
        if (res.data.data) {
          setReturningUsers(true);
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

          dispatch(setUserLikedPost(liked_posts));
          setUserPosts(userPost);
        }
      })
      .catch((res) => console.log(res));

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

          setPosts(res.data.data);

          //this is to get all the likes who posted the individual posts

          setLoader(false);
          setUserLikeAction(false);
        })
        .catch((res) => console.log(res));
    }
  }, [category, userLikeAction]);
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
        userPosts={userPosts}
        topHeaderCategory={topHeaderCategory}
        userId={item.userId}
        phone={phone}
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
          likes={item.likes}
          comments={item.comments}
          post_id={item.id}
          slug={item.slug}
          userPosts={userPosts}
          topHeaderCategory={topHeaderCategory}
          userId={item.userId}
          phone={phone}
        />
      );
    });

  // when user clicks on add post, need to check if the user has already logged in.

  const addPost = () => {
    if (username !== "") {
      navigate("/create-post");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container>
      <SearchBar
        posts={posts}
        setPosts={setPosts}
        searchBarError={searchBarError}
        setSearchBarError={setSearchBarError}
        phone={phone}
        searchBarActive={searchBarActive}
        setSearchBarActive={setSearchBarActive}
      />
      <Header>
        <div style={{ width: "60%", display: "flex", gap: 20 }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <IoMdAdd
            onClick={addPost}
            style={{
              padding: 10,
              borderRadius: 5,
              background: "#ff7f50",
              color: "white",
              cursor: "pointer",
            }}
          />
          <PhoneDropDown allCategories={allCats} />
        </div>
      </Header>
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

export default AllPostsPhone;
