import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { TfiComment } from "react-icons/tfi";
import { FcLike } from "react-icons/fc";
import "../App.css";
import { AiOutlineHeart } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import { setUserLikedPost } from "../../redux/actions";

import defaultImage from "../../images/default-image.png";

const Parent = styled.div`
  position: relative;
  width: 100%;
`;

const Container = styled.div`
  width: ${(props) => (props.phone ? "90%" : "100%")};
  display: flex;
  height: 120px;
  border: 1px solid transparent;
  padding: 15px;
  gap: 25px;
  border-radius: 5px;
  cursor: pointer;
  background: white;
  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.3);
`;
const Image = styled.img`
  width: 25%;
  object-fit: cover;
  border-radius: 5px;
`;
//this is the container for the center portion including time title description and the bottom section in the same column

const MiddlePortion = styled.div`
  width: ${(props) => (props.phone ? "40%" : "50%")};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  justify-content: flex-start;
`;

const Title = styled.div`
    font-size ${(props) => (props.phone ? "1.3rem" : "1.7rem")};
    font-weight:600;
    font-family:sans-serif;
    width:90%;

`;
const Description = styled.span`
    font-size ${(props) => (props.phone ? "0.9rem" : "1.1rem")};
    font-weight:300;
    font-family:Poppins;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    width:90%;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
   color:gray;
`;

const CreatedAt = styled.span`
    font-weight:300;
    font-size ${(props) => (props.phone ? "0.7rem" : "0.8rem")};
    color:gray;
`;

//this is the container for the comments likes and user

const BottomSectionOfMiddlePortion = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const Category = styled.span`
  border: 1px solid #ffa343;

  border-radius: 5px;
  padding: 3px 10px;
  font-family: Poppins;
  font-size: 0.8rem;
  color: #ffa343;
  margin-top: ${(props) => props.phone && "6px"};
`;

const CreatedBy = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  height: 120px;
`;

// this is the container for like and comment icon.

const LikeAndCommentWrapper = styled.div`
  position: absolute;
  right: ${(props) => (props.phone ? "3%" : "5%")};
  bottom: 20px;
`;

const Post = ({
  created_at,
  category_name,
  description,
  image_url,
  title,
  users,
  likes,
  comments,
  post_id,
  slug,
  userPosts,
  phone,
  topHeaderCategory,
  included,
  userId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user_id, userLikedPost } = useSelector((state) => state.userReducer);

  // state to handle local like post to prevent reload of page every time user likes / unlike a post

  const [localLikeCount, setLocalLikeCount] = useState();
  const [localLikePost, setLocalLikePost] = useState(false);
  const [localUserLikedPost, setLocalUserLikedPost] = useState([]);

  // state to handle profile pic of user who created each respective post

  const [profilePic, setProfilePic] = useState();

  useEffect(() => {
    axios.get(`/api/v1/users/${userId}`).then((res) => {
      // using the userId of person that created the post, find his/her profile pic

      setProfilePic(res.data.data.attributes.profile_url);
    });

    setLocalLikeCount(likes.data.length);
    setLocalUserLikedPost(userLikedPost);
  }, [topHeaderCategory]);

  //function to handle like and unlike of a post

  const likeButtonFunctionality = (post_id) => {
    // check if user has logged in

    if (user_id) {
      // need the user_id and post_id
      let obj = {
        post_id: post_id,
      };

      // liking the post

      axios
        .post("/api/v1/likes", obj, { withCredentials: true })
        .then((res) => {
          // successfully liked the post

          if (res.status === 200) {
            // make heart icon red

            setLocalLikePost(true);
            setLocalLikeCount((prev) => prev + 1);
            let temp = {
              post_id: Number(post_id),
              like_id: res.data.data.id,
            };

            // update local like data state

            setLocalUserLikedPost((prev) => [...prev, temp]);
          }
        })
        .catch((res) => {
          // if user has already liked the post

          // decrement local like count

          setLocalLikeCount((prev) => prev - 1);
          setLocalLikePost(false);

          //find the post_id that the user has liked and obtain the like_id to that post_id

          let filtered = localUserLikedPost
            .map((item) => {
              if (
                item.post_id === Number(post_id) ||
                item.post_id === post_id
              ) {
                return item.like_id;
              }
            })
            .filter((item) => item !== undefined);

          let like_id = filtered[0];
          // unlike the post and force a refresh
          axios
            .delete(`/api/v1/likes/${like_id}`)
            .then((res) => {
              let temp = localUserLikedPost;

              const deletedIndex = localUserLikedPost.findIndex(
                (item) => (item) =>
                  item.post_id === Number(post_id) || item.post_id === post_id
              );

              setLocalUserLikedPost(temp.splice(deletedIndex, 1));
            })
            .catch((res) => console.log(res));
        });
    } else {
      navigate("/login");
    }
  };

  const redirectToViewPost = () => {
    dispatch(setUserLikedPost(localUserLikedPost));
    navigate(`post/${post_id}/${slug}`);
  };

  return (
    <Parent>
      <Container onClick={redirectToViewPost} phone={phone}>
        <Image src={image_url} />
        <MiddlePortion phone={phone}>
          <CreatedAt phone={phone}>
            Posted <Moment fromNow>{created_at}</Moment>
          </CreatedAt>
          <Title
            phone={phone}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Title>
          <Description phone={phone}>{description}</Description>
          <BottomSectionOfMiddlePortion>
            <Category phone={phone}>{category_name}</Category>
          </BottomSectionOfMiddlePortion>
        </MiddlePortion>
      </Container>
      <LikeAndCommentWrapper phone={phone}>
        <CreatedBy>
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: 300,
              fontSize: phone ? "0.7rem" : "0.8rem",
              display: "flex",
              gap: phone ? 5 : 10,
              alignItems: "center",
            }}
          >
            @{users}
            <img
              src={profilePic ? profilePic : defaultImage}
              style={{
                width: phone ? 20 : 30,
                height: phone ? 20 : 30,
                borderRadius: phone ? 10 : 15,
                objectFit: "cover",
              }}
            />
          </span>

          <div
            style={{ display: "flex", gap: 5, paddingBottom: phone ? 10 : 5 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                pointerEvents: "all",
              }}
            >
              <span style={{ fontSize: phone ? "1rem" : "1.2rem" }}>
                {localLikeCount}
              </span>

              {(userLikedPost.length > 0 &&
                localUserLikedPost
                  .map((item) => item.post_id)
                  .indexOf(Number(post_id)) !== -1) ||
              localLikePost ? (
                <div
                  style={{ paddingTop: 4, cursor: "pointer" }}
                  onClick={() => likeButtonFunctionality(post_id)}
                >
                  <FcLike style={{ fontSize: phone ? "1.2rem" : "1.3rem" }} />
                </div>
              ) : (
                <AiOutlineHeart
                  style={{
                    fontSize: phone ? "1.2rem" : "1.3rem",
                    cursor: "pointer",
                  }}
                  onClick={() => likeButtonFunctionality(post_id)}
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span style={{ fontSize: phone ? "1rem" : "1.2rem" }}>
                {comments.data.length}
              </span>
              <TfiComment />
            </div>
          </div>
        </CreatedBy>
      </LikeAndCommentWrapper>
    </Parent>
  );
};

export default Post;
