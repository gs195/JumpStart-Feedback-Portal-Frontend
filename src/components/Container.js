import React from "react";
import Input from "./Input";
import SingleItem from "./SingleItem";

function Container({
  fbDocumentArrayByCategory,
  handleStrikethrough,
  spanClickHandler,
  handleInputField,
  theCategory,
  handleEnterPress,
  handleNewInput
}) {
  return (
    <div className={`${String(theCategory)}-container`}>
      <Input
        className="FeedbackInput"
        type="text"
        value={handleInputField(theCategory)}
        onKeyDown={event => handleEnterPress(event, theCategory)}
        placeholder={`${String(theCategory)}`}
        onChange={event => handleNewInput(event, theCategory)}
      />
      <ul className={String(theCategory)}>
        {fbDocumentArrayByCategory.map((document, index) => (
          <SingleItem
            id={document._id}
            key={`${document._id}-${index}`}
            description={document.text}
            onClick={handleStrikethrough}
            className={document.isRemoved ? "notThis" : "item"}
            onClickSpan={event => {
              spanClickHandler(event, document._id);
            }}
          />
        ))}
      </ul>
    </div>
  );
}
export default Container;
