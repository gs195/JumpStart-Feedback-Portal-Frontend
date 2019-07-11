import React from "react";
import Logout from "./Logout";
import "../styles/App.css";
import axios from "axios";
import Login from "./login";
import Feedback2 from "./Feedback2";

const helloText = "Hello!";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: helloText,
      username: "",
      password: ""
    };
  }

  handleNewUsername = event => {
    this.setState({ username: event.target.value });
  };

  handleNewPassword = event => {
    this.setState({ password: event.target.value });
  };

  logoutClick = () => {
    sessionStorage.removeItem("JWT");
    this.setState({ display: "Logging out..." });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  loginClick = () => {
    let myData;
    if (this.state.username === "" || this.state.password === "") {
      return;
    }
    this.setState({ display: "Logging in..." });
    const gotItem = sessionStorage.getItem("JWT");
    if (!gotItem) {
      console.log("entered if !gotItem");
      axios
        .post(`${process.env.REACT_APP_HOST}/jwt/login`, {
          username: this.state.username,
          password: this.state.password
        })
        .then(response => {
          myData = response.data;
          sessionStorage.setItem("JWT", myData.token);
          this.setState({
            display: "Login successful. Loading page data..."
          });
          setTimeout(() => {
            window.location.reload();
          }, 600);
        })
        .catch(err => {
          this.setState({
            display: err.response.data
          });
        })
        .finally(() => {
          this.setState({
            username: "",
            password: ""
          });
        });
    } else {
      this.setState({
        username: "",
        password: "",
        display: "Already logged in"
      });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="sign-in">
          <Logout logoutClick={this.logoutClick} />
          <div className="outcome">
            <span>{`${this.state.display}`}</span>
          </div>
          <Login
            username={this.state.username}
            password={this.state.password}
            handleNewUsername={this.handleNewUsername}
            handleNewPassword={this.handleNewPassword}
            loginClick={this.loginClick}
          />
        </div>
        <div>
          <Feedback2 display={this.state.display} />
        </div>
        <div className="logout-container" />
      </div>
    );
  }
}

export default App;
