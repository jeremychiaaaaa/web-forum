import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// default profile pic if user did not set one
import defaultImage from "../images/default-image.png";
import { FiLogOut } from "react-icons/fi";
import {
  setUserID,
  setUserPic,
  setUsername,
  setLogOut,
  setUserLikedPost,
} from "../redux/actions";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  width: ${props=>!props.phone && '60%'};
  margin: 0px auto;
  padding: 15px 0px;
  transform: ${(props) => props.phone && "translateX(-10px)"};
`;
const Spacing = styled.div`
  width: ${(props) => (props.username !== '' && props.phone ? "15%" : "40%")};
`;
const Login = styled.div`
  padding: ${(props) => (props.phone ? "5px 20px" : "10px 25px")};
  border-radius: 5px;
  border: 1px solid #ff7f50;
  text-align: center;
  color: #ff7f50;
  font-weight: 600;
  font-family: Poppins;

  a {
    color: #ff7f50;
    text-decoration: none;
  }
`;
const Signup = styled.div`
  padding: ${(props) => (props.phone ? "5px 20px" : "10px 25px")};
  border-radius: 5px;
  background-color: #ff7f50;
  border: 1px solid transparent;
  text-align: center;
  color: white;
  font-family: Poppins;
  a {
    color: white;
    text-decoration: none;
  }
`;

const Header = ({ phone }) => {
  const navigate = useNavigate();
  // get the username from redux store

  const { username, user_pic } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const LogOut = () => {
    axios
      .post("/api/v1/sessions/logout", { withCredentials: true })
      .then((res) => {
        console.log(res);
        dispatch(setUsername(""));
        dispatch(setUserID(""));
        dispatch(setUserPic(""));
        dispatch(setUserLikedPost([]));
        dispatch(setLogOut(true));
      })
      .catch((res) => console.log(res));
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        background: "white",
        height: 90,
      }}
    >
      <Spacing phone={phone} username={username} />

      {username === "" ? (
        <Container >
          <Login phone={phone}>
            <Link to="/login">Log In</Link>
          </Login>
          <Signup phone={phone}>
            <Link to="/register">Sign Up</Link>
          </Signup>
        </Container>
      ) : (
        <Container phone={phone}>
          <span
            style={{
              color: "gray",
              fontFamily: "Poppins",
              display: "flex",
              alignItems: "center",
            }}
          >
            Welcome Back, &nbsp;
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
              onClick={() => navigate("/profile")}
            >
              <span style={{ fontWeight: 600, color: "#ff7f50" }}>
                {username}
              </span>
              {user_pic ? (
                <img
                  src={user_pic}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={defaultImage}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </span>
          <FiLogOut
            onClick={LogOut}
            style={{
              color: "gray",
              transform: phone ? "translateX(20px)" : "translateX(50px)",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          />
        </Container>
      )}
    </div>
  );
};

export default Header;
