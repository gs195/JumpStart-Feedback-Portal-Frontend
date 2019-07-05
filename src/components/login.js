import React from "react";
import Button from "./Button";
import Input from "./Input";

function Login({
  handleNewUsername,
  handleNewPassword,
  loginClick,
  username,
  password
}) {
  return (
    <div className="loginDiV">
      <form>
        <Input
          className="username"
          type="text"
          value={username}
          placeholder={`username...`}
          onChange={event => handleNewUsername(event)}
        />
        <Input
          className="password"
          type="text"
          value={password}
          placeholder={`password..`}
          onChange={event => handleNewPassword(event)}
        />
        <Button
          word="Login"
          className="submit"
          type="submit"
          onClick={loginClick}
        />
      </form>
    </div>
  );
}

export default Login;
