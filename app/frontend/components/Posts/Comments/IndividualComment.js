import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { TfiComment } from "react-icons/tfi";
import { FcLike } from "react-icons/fc";
import { AiOutlineDelete, AiOutlineHeart } from "react-icons/ai";
import CommentList from "./CommentList";
import { useNavigate } from "react-router-dom";
import { arrayOf } from "prop-types";

import defaultImage from "../../../images/default-image.png";
const CommentContainer = styled.div`
  width: ${(props) => (props.phone ? "80%" : "85%")};
  height: ${(props) => (props.edit ? "100%" : "120px")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 15px;
  gap: 15px;
  border-radius: 5px;
  cursor: pointer;
  background: white;
  border: 1px solid rgba(220, 220, 220, 0.4);
  margin-top: 20px;
`;

const HorizontalDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 0.9rem;
  font-family: Poppins;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const CreatedAt = styled.div`
  color: gray;
  font-weight: 300;
  font-family: Poppins;
  font-size: 0.9rem;
`;

const Content = styled.div`
  font-family: Poppins;
  margin-top: 20px;
  font-size: 1.1rem;
`;
const InputField = styled.div`
  width: 85%;

  border-radius: 5px;
  z-index: 10;
  position: relative;

  span {
    position: absolute;
    right: -31px;
    bottom: 7px;
    border: 1px solid transparent;
    background-color: ${(props) =>
      props.comment === "" ? "rgba(220,220,220,0.5)" : "#ff7f50"};
    padding: 10px;
    color: ${(props) => (props.comment === "" ? "lightgray" : "black")};
    border-top-left-radius: 5px;
    cursor: pointer;
  }
`;
const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  margin-top: 10px;
  padding: 15px;
  font-family: Poppins;
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.div`
  padding: 5px;
  width: 80px;

  border: 1px solid transparent;
  background-color: #ff7f50;
  color: white;
  border-radius: 5px;
  font-weight: 500;
  font-family: Poppins;
  font-size: 1.1rem;
  text-align: center;
  cursor: pointer;
`;
const CancelButton = styled.div`
  padding: 5px;
  width: 80px;

  border: 1px solid #ff7f50;
  background-color: white;
  color: #ff7f50;
  border-radius: 5px;
  font-weight: 500;
  font-family: Poppins;
  font-size: 1.1rem;
  text-align: center;
  cursor: pointer;
`;

const Line = styled.div`
  border: none;
  background: rgba(220, 220, 220, 0.9);
  padding: 0;
  width: 1px;
  margin-top: 20px;
  position: relative;
  cursor: pointer;
  outline: none;
  transform: translateX(50%);
`;

const BottomSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: space-between;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const IndividualComment = ({
  userId,
  content,
  createdAt,
  commentId,
  reload,
  setReload,
  allComments,
  post_id,
  comment_likes,
  phone,
  comment_likes_data,
}) => {
  const navigate = useNavigate();
  // gets the userId of the current logged in user
  const { username, user_id } = useSelector((state) => state.userReducer);

  const [userComment, setUserComment] = useState("");

  // state to handle child comments

  const [childComment, setChildComment] = useState([]);

  // state to handle making content editable

  const [edit, setEdit] = useState(false);

  const [edited, setEdited] = useState("");

  // state to handle replying a comment

  const [replying, setReplying] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // state to handle the number of replies each comment has
  const [numberOfReplies, setNumberOfReplies] = useState(0);

  // state to handle already liked comments by user

  const [userLikedComment, setUserLikedComment] = useState([]);

  // state to update number of likes locally instead of refreshing page upon each like / unlike action

  const [localLikeCount, setLocalLikeCount] = useState();

  const [localCommentLikeTargetComment, setLocalCommentLikeTargetComment] =
    useState(false);

  // to prevent refresh of the page upon each like / unlike action, store like data in local state

  const [localUserLikedComment, setLocalUserLikedComment] = useState([]);

  // state to handle profile pic of user who uploaded the comment

  const [profileUrl, setProfileUrl] = useState();

  useEffect(() => {
    // set local like count to number of likes taken from database upon last refresh

    setLocalLikeCount(comment_likes);

    // get the comments already liked by the particular logged in user

    if (user_id) {
      axios
        .get(`/api/v1/users/${user_id}`)
        .then((res) => {
          let temp = res.data.included;

          let liked_comment = temp
            .map((item) => {
              if (item.type === "like_comment") {
                return {
                  comment_id: item.attributes.comment_id,
                  like_comment_id: item.id,
                };
              }
            })
            .filter((i) => i !== undefined);

          setUserLikedComment(liked_comment);
          setLocalUserLikedComment(liked_comment);
        })
        .catch((res) => console.log(res));
    }

    // using the userId find the specific username of user who made the comment
    axios
      .get(`/api/v1/users/${userId}`)
      .then((res) => {
        setUserComment(res.data.data.attributes.username);
        setProfileUrl(res.data.data.attributes.profile_url);
        setEdited(content);
      })
      .catch((res) => console.log(res));

    setChildComment(
      allComments.filter(
        (item) => item.attributes.parent_id === Number(commentId)
      )
    );

    // get the number of replies for each comment from the backend server
    axios
      .get(`/api/v1/comments/replies/${commentId}`)
      .then((res) => {
        setNumberOfReplies(res.data.data.length);
      })
      .catch((res) => console.log(res));
  }, [user_id]);

  // action to handle edit comment

  const handleSubmit = () => {
    // send patch request to api with the particular comment_id
    let data = {
      content: edited,
    };
    axios
      .patch(`/api/v1/comments/${commentId}`, data)
      .then((res) => {
        // successfully edited, render new edited comment

        if (res.status === 200) {
          setReload(true);
          setEdit(false);
        }
      })
      .catch((res) => console.log(res));
  };

  // action to handle delete comment

  const handleDelete = () => {
    axios
      .delete(`/api/v1/comments/${commentId}`)
      .then((res) => {
        // this means comment successfully deleted, re render updates
        if (res.status === 204) {
          setReload(true);
        }
      })
      .catch((res) => console.log(res));
  };

  const handleSubmitReply = () => {
    //check if the user has already logged in before allowing them to submit reply

    if (username === "") {
      navigate("/login");
    } else {
      let commentData = {
        content: newComment,
        post_id: post_id,
        user_id: userId,
        parent_id: commentId,
      };

      axios
        .post(`/api/v1/comments`, commentData, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            setReplying(false);
            setReload(true);
          }
        })
        .catch((res) => console.log(res));
    }
  };

  // action to handle liking a comment

  const handleLikeComment = () => {
    let data = {
      comment_id: commentId,
    };

    // check if user has already logged in before allowing them to like a comment

    if (user_id) {
      // once confirmed that user has logged in, update the local state and update the database in the meantime

      axios
        .post("/api/v1/like_comments", data, { withCredentials: true })
        .then((res) => {
          // successfully like a comment
          if (res.status === 200) {
            setLocalLikeCount((prev) => prev + 1);
            setLocalCommentLikeTargetComment(true);

            let temp = {
              comment_id: Number(commentId),
              like_comment_id: res.data.data.id,
            };
            setLocalUserLikedComment((prev) => [...prev, temp]);
          }
        })
        .catch((res) => {
          // if user has already liked the comment
          setLocalLikeCount((prev) => prev - 1);
          setLocalCommentLikeTargetComment(false);

          let filtered = localUserLikedComment
            .map((item) => {
              if (
                item.comment_id === Number(commentId) ||
                item.comment_id === commentId
              ) {
                return item.like_comment_id;
              }
            })
            .filter((item) => item !== undefined);

          let like_comment_id = filtered[0];

          axios
            .delete(`/api/v1/like_comments/${like_comment_id}`)
            .then((res) => {
              let temp = localUserLikedComment;
              const deletedIndex = localUserLikedComment.findIndex(
                (item) => (item) =>
                  item.comment_id === Number(commentId) ||
                  item.comment_id === commentId
              );
              setLocalUserLikedComment(temp.splice(deletedIndex, 1));
            })
            .catch((res) => console.log(res));
        });
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <CommentContainer edit={edit} phone={phone}>
        <HorizontalDiv>
          <Title>
            By @{userComment}
            <img
              src={profileUrl ? profileUrl : defaultImage}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                objectFit: "cover",
              }}
            />
          </Title>
          <CreatedAt>
            <Moment fromNow>{createdAt}</Moment>
          </CreatedAt>
        </HorizontalDiv>

        <HorizontalDiv>
          {edit ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "90%",
              }}
            >
              <form style={{ width: "100%" }} onSubmit={handleSubmit}>
                <InputField>
                  <TextArea
                    value={edited}
                    name="edited"
                    onChange={(e) => setEdited(e.target.value)}
                  />
                </InputField>
              </form>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  width: "90%",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <CancelButton onClick={() => setEdit(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
              </div>
            </div>
          ) : (
            <Content>{content}</Content>
          )}

          {/* This here makes sure that the edit and delete icon will only appear on posts that belong to a user */}

          {Number(user_id) === userId && (
            <div style={{ display: "flex", gap: 15, marginTop: 20 }}>
              <CiEdit
                strokeWidth={1}
                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                onClick={() => setEdit(true)}
              />
              <AiOutlineDelete
                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                onClick={handleDelete}
              />
            </div>
          )}
        </HorizontalDiv>
        <BottomSection>
          <IconWrapper>
            <span>{localLikeCount}</span>

            {/* this makes sure that if the user has already liked the post, then red heart icon to indicate already liked it */}

            {(userLikedComment.length > 0 &&
              localUserLikedComment
                .map((item) => item.comment_id)
                .indexOf(Number(commentId)) !== -1) ||
            localCommentLikeTargetComment ? (
              <FcLike
                style={{
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  marginBottom: 3,
                }}
                onClick={handleLikeComment}
              />
            ) : (
              <AiOutlineHeart
                style={{ fontSize: "1.3rem", cursor: "pointer" }}
                onClick={handleLikeComment}
              />
            )}
          </IconWrapper>

          <IconWrapper>
            <span>{numberOfReplies}</span>
            <TfiComment
              style={{ fontSize: "1.2rem", marginTop: 3, cursor: "pointer" }}
            />
          </IconWrapper>

          <span
            style={{ fontFamily: "Poppins", cursor: "pointer" }}
            onClick={() => setReplying(!replying)}
          >
            Reply
          </span>
        </BottomSection>
      </CommentContainer>

      {/* section here will be for rendering a comment form when user clicks on reply */}

      {replying && (
        <InputField comment={newComment}>
          <TextArea
            autoFocus
            rows="5"
            placeholder="Add A Reply"
            name="newComment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <span onClick={handleSubmitReply}>Submit</span>
          {errorMessage !== "" && (
            <span
              style={{
                color: "red",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "red",
              }}
            >
              {errorMessage}
            </span>
          )}
        </InputField>
      )}

      {/* section here will be for if there are any nested replies to a comment */}

      {childComment?.length > 0 && (
        <div style={{ display: "flex", gap: 20 }}>
          <Line />
          <div style={{ paddingLeft: "0.5rem", flexGrow: 1 }}>
            <CommentList
              comments={childComment}
              reload={reload}
              setReload={setReload}
              allComments={allComments}
              phone={phone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default IndividualComment;
