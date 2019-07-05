import React from "react";

function Input({ type, className, value, onKeyDown, placeholder, onChange }) {
  return (
    <input
      className={className}
      type={type}
      value={value}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

export default Input;
