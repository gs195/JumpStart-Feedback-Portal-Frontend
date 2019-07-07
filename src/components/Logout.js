import React from "react";
import Button from "./Button";

function Logout({ logoutClick }) {
  return (
    <div className="logoutDiv">
      {/* <form> */}
        <Button
          word="Logout"
          className="logout"
          type="submit"
          onClick={logoutClick}
        />
      {/* </form> */}
    </div>
  );
}

export default Logout;
