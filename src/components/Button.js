import React from "react";

function Button({ type, onClick, className, word, id }) {
  return (
    <button id={id} className={className} type={type} onClick={onClick}>
      {word}
    </button>
  );
}

export default Button;
