import React from "react";

function Input({
  type,
  className,
  value,
  onKeyDown,
  placeholder,
  onChange,
  disabled
}) {
  return (
    <input
      className={className}
      type={type}
      value={value}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export default Input;
