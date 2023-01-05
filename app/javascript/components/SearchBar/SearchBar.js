import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import { HiSearch } from "react-icons/hi";
// adapted this search bar component from https://www.google.com/search?q=search+bar+react&rlz=1C5CHFA_enSG1010SG1011&oq=search+bar+&aqs=chrome.2.69i57j0i512l9.3145j0j4&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:414413ec,vid:x7niho285qs

const SearchBar = ({
  posts,
  setPosts,
  searchBarActive,
  setSearchBarActive,
  searchBarError,
  setSearchBarError,
  phone,
}) => {
  // make a copy of the original posts so that we can reset it when search bar is resetted by user

  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    setOriginalData(posts);
  }, [searchBarActive]);

  const handleChange = (e) => {
    // get the input search from user
    const searchTitle = e.target.value;

    // filter the data based on the search title

    let temp = posts.filter((item) => {
      return item.attributes.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase());
    });

    // make sure to reset search title

    if (searchTitle === "") {
      setPosts(originalData);
    } else {
      if (temp.length === 0) {
        setSearchBarError(searchTitle);
      }
      setPosts(temp);
    }
  };

  return (
    <div
      className={
        phone
          ? "search-bar-wrapper-phone"
          : searchBarActive
          ? "search-bar-wrapper-active"
          : "search-bar-wrapper"
      }
    >
      {phone ? (
        <>
          <HiSearch
            style={{
              color: "#ff7f50",
              padding: 5,
              fontSize: "1.7rem",
              background: "transparent",
            }}
          />

          <input
            className="search-bar-input"
            type="text"
            placeholder="Search for a post"
            onChange={handleChange}
            onClick={() => setSearchBarActive(true)}
          />
        </>
      ) : searchBarActive ? (
        <>
          <HiSearch
            onClick={() => setSearchBarActive(false)}
            style={{
              color: "#ff7f50",
              padding: 15,
              fontSize: "1.7rem",
              background: "transparent",
            }}
          />

          <input
            className="search-bar-input"
            type="text"
            placeholder="Search for a post"
            onChange={handleChange}
          />
        </>
      ) : (
        <HiSearch
          onClick={() => setSearchBarActive(true)}
          style={{
            color: "#ff7f50",
            padding: 16,
            background: "rgba(220,220,220,0.8)",
            color: "#ff7f50",
            transform: "translate(30px,4px)",
            borderRadius: 5,
            cursor: "pointer",
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
