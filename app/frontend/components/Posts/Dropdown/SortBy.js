import React, { useState, useEffect } from "react";

import { BiChevronDown } from "react-icons/bi";

const SortBy = ({ sortCategory, setSortCategory, phone }) => {
  const [active, setActive] = useState(false);

  const selectItem = (name) => {
    setSortCategory(name);
    setActive(false);
  };

  return (
    <div className="dropdown" style={{ width: !phone && 200, marginTop: 60 }}>
      <div
        className="dropdown-button"
        style={{
          padding: phone ? "5px 10px" : "10px 5px",
          fontSize: phone ? "1.1rem" : "1.2rem",
        }}
        onClick={() => setActive(!active)}
      >
        <span> Sort By </span>
        <BiChevronDown />
      </div>
      {active && (
        <div className="dropdown-content" style={{ zIndex: 20 }}>
          <div
            className={
              sortCategory === "Most Popular"
                ? "dropdown-item-default"
                : "dropdown-item"
            }
            onClick={() => selectItem("Most Popular")}
          >
            Most Popular
          </div>
          <div
            className={
              sortCategory === "Latest First"
                ? "dropdown-item-default"
                : "dropdown-item"
            }
            onClick={() => selectItem("Latest First")}
          >
            Latest First
          </div>
        </div>
      )}
    </div>
  );
};

export default SortBy;
