import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { setCategory } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { setAllCategories } from "../redux/actions";
const LeftBar = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;

  gap: 35px;

  align-items: flex-start;
  height: 100vh;
  overflow: hidden;
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const IndividualCategory = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 20px 15px 20px 65px;
  background-color: ${(props) =>
    props.active ? "rgba(220,220,220,0.5)" : "white"};
  clip-path: ${(props) =>
    props.active &&
    "polygon(82% 0, 100% 50%, 82% 100%, 0% 100%, 0 50%, 0% 0%)"};
  border-left: ${(props) => (props.active ? "5px solid #ffa343" : "none")};
  cursor: pointer;
`;

const Logo = styled.img`
  width: 20px;
  height: 20px;
`;

const LeftColumn = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(-1);

  //get the category state in the redux store

  const { category, allCategories } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get("/api/v1/categories.json")
      .then((res) => dispatch(setAllCategories(res.data.data)))
      .catch((res) => console.log(res));
  }, []);

  //this function here is called when user clicks on a category on the left column and there will be a GET request to our API to fetch posts belonging to that category

  const fetchCategoryPosts = (index, name) => {
    setSelected(index);
    dispatch(setCategory(name));
    navigate("/");
  };

  return (
    <LeftBar>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          height: 90,
          paddingTop: 20,
        }}
      >
        <span
          style={{
            fontSize: "1.6rem",
            textAlign: "center",
            cursor: "pointer",
            fontWeight: 600,
            letterSpacing: "0.2rem",
            textAlign: "center",
            fontFamily: "Poppins",
          }}
          onClick={() => navigate("/")}
        >
          WEBTALK
        </span>
      </div>
      <Categories>
        <IndividualCategory
          onClick={() => fetchCategoryPosts(-1, "All")}
          active={selected === -1 ? true : false}
        >
          <Logo src="https://cdn-icons-png.flaticon.com/512/1946/1946488.png" />
          <span
            style={{
              color: selected === -1 ? "#1e90ff" : "gray",
              fontFamily: "Lato",
            }}
          >
            Home
          </span>
        </IndividualCategory>
        {allCategories.map((category, index) => (
          <IndividualCategory
            onClick={() => fetchCategoryPosts(index, category.attributes.name)}
            active={selected === index ? true : false}
          >
            <Logo src={category.attributes.icon_url} />
            <span
              style={{
                color: selected === index ? "#1e90ff" : "gray",
                fontFamily: "Lato",
              }}
            >
              {category.attributes.name}
            </span>
          </IndividualCategory>
        ))}
      </Categories>
    </LeftBar>
  );
};

export default LeftColumn;
