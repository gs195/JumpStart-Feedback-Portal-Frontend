import React from "react";
import Button from "./Button";

function Logout({ logoutClick }) {
  return (
    <div className="logoutDiv">
        <Button
          word="Logout"
          className="logout"
          type="submit"
          onClick={logoutClick}
        />
    </div>
  );
}

export default Logout;
