import React from "react";

export const Star = ({ name, onClick, isChecked }) => {
  return (
    <span
      className="star"
      onClick={() => {
        onClick(name);
      }}
      style={{ color: isChecked ? "yellow" : "grey" }}
    >
      &#9733;
    </span>
  );
};
