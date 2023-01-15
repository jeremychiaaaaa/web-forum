import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { TfiComment } from "react-icons/tfi";
import { FcLike } from "react-icons/fc";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { setUnlikePost, setUserLikedPost } from "../../redux/actions";
import defaultImage from "../../images/default-image.png";

const Parent = styled.div`
  position: relative;
  width: 100%;
`;

const Container = styled.div`
  width: ${(props) => (props.phone ? "90%" : "100%")};
  display: flex;
  height: 160px;
  border: 1px solid transparent;
  padding: 15px;
  gap: 25px;
  border-radius: 5px;
  cursor: pointer;
  background: white;
  box-shadow: 10px 10px 15px -4px rgba(0, 0, 0, 0.3);
`;

const Placeholder = styled.div`
  width: ${(props) => (props.phone ? "25%" : "15%")};
  height: 100%;
  background-color: lightgray;
  border-radius: 5px;
`;

const Image = styled.img`
  width: ${(props) => (props.phone ? "25%" : "15%")};
  object-fit: cover;
  border-radius: 5px;
  display: ${(props) => (props.imageLoading && "none")};
`;
//this is the container for the center portion including time title description and the bottom section in the same column

const MiddlePortion = styled.div`
  width: ${(props) => (props.phone ? "40%" : "60%")};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  justify-content: space-between;
  overflow: hidden;
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
    white-space: break-spaces;
    overflow:  ${(props) => (props.phone ? "auto" : "hidden")};
    text-overflow: ellipsis;
    display: -webkit-box;
    width:100%;
   -webkit-line-clamp: ${(props) =>
     props.phone ? 3 : 2}; /* number of lines to show */
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
  height: ${(props) => (props.phone ? "160px" : "120px")};
`;

// this is the container for like and comment icon.

const LikeAndCommentWrapper = styled.div`
  position: absolute;
  right: ${(props) => (props.phone ? "5%" : "5%")};
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
  phone,
  topHeaderCategory,
  included,
  userId,
  setLoader,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user_id, userLikedPost, userPosts } = useSelector(
    (state) => state.userReducer
  );

  // state to handle like count
  const [localLikeCount, setLocalLikeCount] = useState();

  // state to handle profile pic of user who created each respective post
  const [profilePic, setProfilePic] = useState();

  // state to handle loading image state
  const [imageLoading, setImageLoading] = useState(true);

  // state to handle loading profile image state
  const [profileImageLoading, setProfileImageLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/v1/users/${userId}`).then((res) => {
      // using the userId of person that created the post, find his/her profile pic
      setProfilePic(res.data.data.attributes.profile_url);
    });
    setLocalLikeCount(likes.data.length);
    setLoader(false);
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
            setLocalLikeCount((prev) => prev + 1);
            let temp = {
              post_id: Number(post_id),
              like_id: res.data.data.id,
            };
            dispatch(setUserLikedPost(temp));
          }
        })
        .catch((res) => {
          // if user has already liked the post
          // decrement local like count

          setLocalLikeCount((prev) => prev - 1);
          //find the post_id that the user has liked and obtain the like_id to that post_id
          const temp = userLikedPost;
          console.log(temp);
          let filtered = temp
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
              const id = post_id;
              dispatch(setUnlikePost(post_id));
            })
            .catch((res) => console.log(res));
        });
    } else {
      navigate("/login");
    }
  };

  const redirectToViewPost = () => {
    navigate(`post/${post_id}/${slug}`);
  };
  console.log(imageLoading);

  return (
    <Parent>
      <Container onClick={redirectToViewPost} phone={phone}>
        <Image
          onLoad={() => setImageLoading(false)}
          src={image_url}
          phone={phone}
          imageLoading={imageLoading}
        />
        {imageLoading && <div className="skeleton" />}

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
        <CreatedBy phone={phone}>
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: 300,
              fontSize: phone ? "0.7rem" : "0.8rem",
              display: "flex",
              gap: phone ? 5 : 10,
              alignItems: "center",
              marginTop: phone && 2,
              transform: !phone && "translateY(-40px)",
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
                display: profileImageLoading && 'none'
              }}
              onLoad={() => setProfileImageLoading(false)}
            />
            {profileImageLoading && <div className="skeleton-profile-image" />}
          </span>

          <div
            style={{
              display: "flex",
              gap: 5,
              paddingBottom: phone ? 0 : 5,
              transform: phone && "translateX(3px)",
            }}
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

              {userLikedPost.length > 0 &&
              userLikedPost
                .map((item) => item.post_id)
                .indexOf(Number(post_id)) !== -1 ? (
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
