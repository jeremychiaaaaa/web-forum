// drop-down component was built with help from this tutorial :  https://www.youtube.com/watch?v=C845oiKpxcg&t=462s&ab_channel=TechCareWeb

import React, { useState, useEffect } from "react";
import "./Dropdown.css";
import { BiChevronDown } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setCategory } from "../../../redux/actions";
const Dropdown = ({
  allCategories,
  categoryChoose,
  setCategoryChoose,
  categoryIDChoose,
  setCategoryIDChoose,
  phone,
}) => {
  const dispatch = useDispatch();
  // state to handle open or close the dropdown menu

  const [active, setActive] = useState(false);

  const selectItem = (name, id) => {
    setCategoryChoose(name);
    setCategoryIDChoose(id);
    setActive(false);
  };

  // action to handle user filtering post by category

  const phoneSelectCategory = (name, index) => {
    dispatch(setCategory(name));
  };

  return (
    <div className="dropdown">
      <div className="dropdown-button" onClick={() => setActive(!active)}>
        {categoryChoose ? (
          <span>{categoryChoose}</span>
        ) : (
          <span> Select a category </span>
        )}

        <BiChevronDown />
      </div>
      {active && (
        <div className="dropdown-content">
          {allCategories
            .filter((i, index) => index <= 5)
            .map((item, index) => (
              <div
                className="dropdown-item"
                onClick={() => selectItem(item.name, item.id)}
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
