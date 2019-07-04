import React from "react";

function Button({ type, onClick, className }) {
  return (
    <button className={className} type={type} onClick={onClick}>
      Submit
    </button>
  );
}

export default Button;
