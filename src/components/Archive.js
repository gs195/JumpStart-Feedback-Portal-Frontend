import React from "react";
import Button from "./Button";

function Archive({ archiveClick }) {
  return (
    <div className="archiveDiv">
      <Button
        word="Archive"
        className="archive"
        type="submit"
        onClick={archiveClick}
      />
    </div>
  );
}

export default Archive;
