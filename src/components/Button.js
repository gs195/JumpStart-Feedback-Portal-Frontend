import React from "react";

function Button({ type, onClick, className, word }) {
  return (
    <button className={className} type={type} onClick={onClick}>
      {word}
    </button>
  );
}

export default Button;
