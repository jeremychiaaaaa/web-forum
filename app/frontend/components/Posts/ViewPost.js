import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import Post from "./Post";
import { TfiComment } from "react-icons/tfi";
import { FcLike } from "react-icons/fc";
import CommentList from "./Comments/CommentList";
import IndividualComment from "./Comments/IndividualComment";
import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";
import SortBy from "./Dropdown/SortBy";
// shall use the react-modal package to handle the popup modal to check before user deletes the post
import Modal from "react-modal";
import ReactLoading from "react-loading";
import { MagnifyingGlass } from "react-loader-spinner";
import { setUnlikePost } from "../../redux/actions";
import {
  setUserID,
  setUserLikedPost,
  setUsername,
  setUserPic,
  setSuccessfulEdit,
} from "../../redux/actions";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  gap: 25px;
  width: ${(props) => (props.phone ? "100%" : "85%")};

  margin: 0px auto;
  position: relative;
  background-color: white;
`;

const Wrapper = styled.div`
  width: 100%;

  padding: ${(props) => (props.phone ? "20px" : "20px 50px")};
`;

const TopHeaderPortion = styled.div`
  width: 90%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Username = styled.div`
  font-family: Poppins;
  font-size: 0.9rem;
  color: gray;
`;

const Title = styled.div`
  font-family: Poppins;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: Poppins;
`;

const Image = styled.img`
  width: 90%;
  max-height: 700px;
  object-fit: cover;
  object-position: 50% 0%;
  margin-top: 25px;
`;

const Body = styled.div`
  font-family: Poppins;
  font-size: 1.2rem;
  margin-top: 25px;
  width: 90%;
`;

const InputField = styled.div`
  width: 85%;
  position: relative;

  border-radius: 5px;
  z-index: 10;
  textarea {
    width: ${(props) => (props.phone ? "95%" : "100%")};
    min-height: 80px;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    margin: 12px 0;
    padding: 15px;
    font-family: Poppins;
  }

  span {
    position: absolute;
    right: ${(props) => (props.phone ? "-16px" : "-31px")};
    bottom: 19px;
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
  width: ${(props) => (props.phone ? "95%" : "100%")};
  min-height: 80px;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  margin: 12px 0;
  padding: 15px;
  font-family: Poppins;

  &:focus {
    outline: none;
  }
`;

const Keep = styled.div`
  padding: 10px 25px;
  border-radius: 5px;
  border: 1px solid #ff7f50;
  text-align: center;
  color: #ff7f50;
  font-weight: 600;
  font-family: Poppins;
  cursor: pointer;
  a {
    color: #ff7f50;
    text-decoration: none;
  }
`;
const Delete = styled.div`
  padding: 10px 25px;
  border-radius: 5px;
  background-color: #ff7f50;
  border: 1px solid transparent;
  text-align: center;
  color: white;
  font-family: Poppins;
  cursor: pointer;
  a {
    color: white;
    text-decoration: none;
  }
`;

// adapted directly from the react-modal package

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: "5px",
    overflowX: "hidden",
    padding: 0,
  },
};

// phone styles for phone modal

const customPhoneStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    width: "95%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: "5px",
    overflowX: "hidden",
    padding: 0,
  },
};

const ViewPost = ({ phone }) => {
  // get the specific post based on slug value from api
  const dispatch = useDispatch();
  const { slug, post_id } = useParams();
  const { username, user_id, userLikedPost } = useSelector(
    (state) => state.userReducer
  );

  //state variables to store the specific post details

  const [postUsername, setPostUsername] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageUrl] = useState("");
  const [commentsCount, setCommentsCount] = useState();

  const [comment, setComment] = useState("");

  // state to handle comments related to post

  const [allComments, setAllComments] = useState([]);

  // state to store parent comments
  const [parentComments, setParentComments] = useState([]);

  // state to re-render after user successfully posted a comment

  const [reload, setReload] = useState(false);

  // state to handle errors

  const [errorMessage, setErrorMessage] = useState("");

  // state to handle open and close modal component to confirm if user wants to delete post

  const [modalOpen, setModalOpen] = useState(false);

  // state to handle loader when user adds a comment to a post

  const [loaderModal, setLoaderModal] = useState(false);

  // state to handle sorting category of comments
  // by default parent comments will be displayed by popularity (ie number of likes)

  const [sortCategory, setSortCategory] = useState("Most Popular");

  // local state to handle liking of post ( same idea as liking post on main page)
  const [localLikeCount, setLocalLikeCount] = useState();

  //state to handle while fetching data from backend
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setParentComments([]);
    setLoader(true);
    // check if user has previously logged in and already stored in cookies then automatically log him in

    axios
      .get(`/api/v1/posts/${post_id}/${slug}`)
      .then((res) => {
        setPostUsername(res.data.data.attributes.username);
        setTitle(res.data.data.attributes.title);
        setDescription(res.data.data.attributes.description);
        setImageUrl(res.data.data.attributes.image_url);
        setPostUsername(res.data.data.attributes.username);
        setLocalLikeCount(res.data.data.relationships.likes.data.length);
        setCommentsCount(res.data.data.relationships.comments.data.length);
      })
      .catch((res) => console.log(res));
    // get all comments related to this post
    axios
      .get(`/api/v1/comments/${post_id}`)
      .then((res) => {
        let temp = res.data.data;
        setAllComments(temp);
        let parents = temp.filter((item) => item.attributes.parent_id === null);

        if (sortCategory === "Most Popular") {
          let parentsSortedByPopularity = parents.sort((a, b) => {
            return (
              b.relationships.like_comments.data.length -
              a.relationships.like_comments.data.length
            );
          });

          setParentComments(parentsSortedByPopularity);
        } else {
          setParentComments(parents);
        }

        setReload(false);
      })
      .catch((res) => console.log(res));

    setLoader(false);
  }, [sortCategory, reload]);

  // action to handle posting a comment

  const SubmitComment = () => {
    // need to check if user is logged in already
    if (username === "") {
      navigate("/login");
    } else {
      setLoaderModal(true);
      let data = {
        content: comment,
        post_id: post_id,
        user_id: user_id,
      };

      axios
        .post("/api/v1/comments", data, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            setReload(true);
            setComment("");
            setLoaderModal(false);
          } else {
            setErrorMessage(res.data.errors);
          }
        })
        .catch((res) => console.log(res));
    }
  };

  // action to handle edit post

  const editPost = (post_id, slug, e) => {
    e.preventDefault();
    navigate(`/edit/${post_id}/${slug}`);
  };

  // action to handle delete post

  const deletePost = () => {
    axios
      .delete(`/api/v1/posts/${post_id}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 204) {
          // this means successfully deleted, then bring back user to home page
          setModalOpen(false);
          navigate("/");
        }
      })
      .catch((res) => console.log(res));
  };

  // action to like the post

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

            //update redux stor with new like object
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
          // unlike the post
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

  const toggleModal = () => {
    if (modalOpen) {
      setModalOpen(false);
    } else if (loaderModal) {
      setLoaderModal(false);
    }
  };

  return (
    <>
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
      ) : (
        <Container phone={phone}>
          {/* Modal component here is the popup message before a user deletes a post or loader component after user creates a comment  */}
          <Modal
            isOpen={modalOpen || loaderModal}
            style={phone ? customPhoneStyles : customStyles}
          >
            <div
              style={{
                padding: 16,
                borderBottom: "1px solid rgba(220,220,220,0.3)",
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
                alignItems: "center",
              }}
            >
              {modalOpen && <span>Delete Post</span>}
              {/* spacing */}
              {loaderModal && <div></div>}
              <AiOutlineClose
                style={{ fontSize: "1.1rem", cursor: "pointer" }}
                onClick={toggleModal}
              />
            </div>
            {modalOpen && (
              <span
                style={{
                  width: phone ? "90%" : "100%",
                  margin: "10px 0",
                  padding: 16,
                  fontSize: "1.1rem",
                }}
              >
                Are you sure you want to delete your post?
              </span>
            )}

            {loaderModal && (
              <ReactLoading
                type={"bubbles"}
                color={"#ff7f50"}
                height={100}
                width={"100%"}
                className="comment-loader"
              />
            )}
            <div
              style={{
                display: "flex",
                padding: phone ? 20 : 15,
                background: "rgba(220,220,220,0.4)",
                width: "100%",
                position: "relative",
                height: !phone && 40,
              }}
            >
              {modalOpen && (
                <>
                  <div style={{ width: phone && "35%" }}></div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      position: !phone && "absolute",
                      right: !phone && "15%",
                    }}
                  >
                    <Keep onClick={() => setModalOpen(false)}>Keep</Keep>
                    <Delete onClick={deletePost}>Delete</Delete>
                  </div>
                </>
              )}
              {/* div for spacing */}
            </div>
          </Modal>

          {/* End of Modal Component */}

          <Wrapper phone={phone}>
            <TopHeaderPortion>
              <Username>By @{postUsername}</Username>
              <div style={{ display: "flex", gap: 5 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{localLikeCount}</span>
                  {/* Color of heart depends on if user has liked the post */}
                  {userLikedPost.length > 0 &&
                  userLikedPost
                    .map((item) => item.post_id)
                    .indexOf(Number(post_id)) !== -1 ? (
                    <div
                      style={{ paddingTop: 4, cursor: "pointer" }}
                      onClick={() => likeButtonFunctionality(post_id)}
                    >
                      <FcLike style={{ fontSize: "1.3rem" }} />
                    </div>
                  ) : (
                    <AiOutlineHeart
                      style={{ fontSize: "1.3rem", cursor: "pointer" }}
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
                  <span style={{ fontSize: "1.2rem" }}>{commentsCount}</span>
                  <TfiComment />
                </div>
              </div>
            </TopHeaderPortion>

            <div
              style={{
                display: "flex",
                width: "90%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title>{title}</Title>
              <div style={{ display: "flex", gap: 5 }}>
                {/* This here makes sure that the edit and delete icon will only appear on posts that belong to a user */}

                {username === postUsername && (
                  <>
                    <CiEdit
                      strokeWidth={1}
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={(e) => editPost(post_id, slug, e)}
                    />
                    <AiOutlineDelete
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={() => setModalOpen(true)}
                    />
                  </>
                )}
              </div>
            </div>

            <Image src={imageURL} />
            <Body>{description}</Body>

            <div
              style={{
                display: "flex",
                width: "85%",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 30,
              }}
            >
              <Title style={{ marginTop: 60, fontSize: "1.2rem" }}>
                Comments ({commentsCount})
              </Title>

              <SortBy
                phone={phone}
                sortCategory={sortCategory}
                setSortCategory={setSortCategory}
              />
            </div>

            <InputField comment={comment} phone={phone}>
              <TextArea
                phone={phone}
                rows="5"
                placeholder="Add A Comment"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <span onClick={SubmitComment}>Submit</span>
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

            {parentComments !== null && parentComments.length > 0 && (
              <CommentList
                phone={phone}
                comments={parentComments}
                reload={reload}
                setReload={setReload}
                allComments={allComments}
                post_id={post_id}
              />
            )}
          </Wrapper>
        </Container>
      )}
    </>
  );
};

export default ViewPost;
