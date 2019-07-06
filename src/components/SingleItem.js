import React from "react";

function SingleItem({
  description,
  onClick,
  className,
  id,
  onClickSpan
}) {
  return (
    <div className="wrapper">
      <li
        id={id}
        className={className}
        onClick={onClick}
      >
        {description}
        <span onClick={onClickSpan}>X</span>
      </li>
    </div>
  );
}

export default SingleItem;
