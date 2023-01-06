import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { setUsername, setUserID, setUserPic } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

const Container = styled.div`
  width: 100%;
  background: #fff2e5;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.phone ? "70%" : "30%")};
  justify-content: center;
  background-color: white;
  align-items: center;
  gap: 5px;
  padding: ${(props) => (props.phone ? "60px 30px" : "30px 20px")};
  border-radius: 5px;
`;

const InputField = styled.div`
  width: 90%;

  border-radius: 5px;
  z-index: 10;

  input {
    width: 100%;

    min-height: 30px;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    margin: 12px 0;
    padding: 15px;
  }
`;

const LoginButton = styled.div`
  padding: 15px;
  width: 90%;
  margin-top: 10px;
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

const Login = ({ phone }) => {
  const navigate = useNavigate();
  const { new_user } = useSelector((state) => state.userReducer);
  //we will store the username in the a temporary state then pass it to the redux store in the handleSubmit action

  const [temporaryUsername, setTemporaryUsername] = useState("");
  const dispatch = useDispatch();

  //state to store the password

  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // submit function to be login user using the api end point created in the rails backend

  // state to handle loading while posting request to backend

  const [successfullyPosted, setSuccessfullyPosted] = useState("default");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessfullyPosted("posting");
    let user = {
      username: temporaryUsername,
      password: password,
    };

    axios
      .post("/api/v1/sessions/login", user, { withCredentials: true })
      .then((res) => {
        // this means that the user has successfully logged in

        // set redux store username, user_id, user_pic state

        dispatch(setUsername(temporaryUsername));
        dispatch(setUserID(res.data.data.id));
        dispatch(setUserPic(res.data.data.attributes.profile_url));
        setSuccessfullyPosted("end");
        //after login navigate back to home page

        navigate(new_user ? "/" : -1);
      })
      .catch((res) => {
        setSuccessfullyPosted("end");
        setErrorMessage("Please check that your username/password is correct");
      });
  };

  return (
    <Container>
      <Wrapper phone={phone}>
        <span
          style={{
            fontFamily: "Poppins",
            fontSize: "1.2rem",
            fontWeight: 600,
            padding: 5,
          }}
        >
          Welcome Back
        </span>
        <span
          style={{
            color: "gray",
            fontWeight: 300,
            fontFamily: "Poppins",
            fontSize: "0.8rem",
          }}
        >
          Enter your credentials to access your account
        </span>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <InputField>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setTemporaryUsername(e.target.value)}
            />
          </InputField>
          <InputField>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputField>
          <LoginButton onClick={handleSubmit}>Log In</LoginButton>
        </form>
        <span
          style={{
            fontFamily: "Poppins",
            color: "gray",
            fontSize: "0.9rem",
            marginTop: phone && 15,
            cursor: "pointer",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{
              fontWeight: 600,
              color: "#ff7f50",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </span>
        {errorMessage !== "" && (
          <span
            style={{
              color: "red",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "red",
              fontFamily: "Poppins",
            }}
          >
            {errorMessage}
          </span>
        )}
        {successfullyPosted === "posting" && (
          <ReactLoading
            type={"bubbles"}
            color={"#ff7f50"}
            height={70}
            width={70}
          />
        )}
      </Wrapper>
    </Container>
  );
};

export default Login;
