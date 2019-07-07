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
      </li>
        <span onClick={onClickSpan}>❌</span>
    </div>
  );
}

export default SingleItem;
