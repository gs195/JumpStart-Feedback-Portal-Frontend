import React from "react";
import Logout from "./Logout";
import "../styles/App.css";
import axios from "axios";
import Login from "./login";
import Feedback2 from "./Feedback2";
import Button from "./Button";
import "./App/App.css";
import SignUpModal from "./sign-up-modal";
import Modal from "react-modal";

Modal.setAppElement("#react-modal");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "Feedback Portal",
      username: "",
      password: "",
      modalIsOpen: false,
      newUsername: "",
      newPassword: "",
      newRole: "",
      newName: "",
      loggedIn: false,
      modalMessage: ""
    };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

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
      axios
        .post(`${process.env.REACT_APP_HOST}/jwt/login`, {
          username: this.state.username,
          password: this.state.password
        })
        .then(response => {
          myData = response.data;
          sessionStorage.setItem("JWT", myData.token);
          this.setState({
            display: "Login successful. Loading page data...",
            loggedIn: true
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

  signupClick = (event) => {
    event.preventDefault();
    axios
      .post(`${process.env.REACT_APP_HOST}/jwt/signup`, {
        username: this.state.newUsername,
        password: this.state.newPassword,
        role: this.state.newRole,
        name: this.state.newName
      })
      .then(response => {
        const res = response.data;
        sessionStorage.setItem("JWT", res.token);
        this.setState({
          display: `Signup successful. Logging in as ${res.username}`,
          loggedIn: true,
          newUsername: "",
          newPassword: "",
          newRole: "",
          newName: ""
        });
        setTimeout(() => {
          this.closeModal();
          window.location.reload()
        }, 1000);
      })
      .catch(err => {
        this.setState({
          modalMessage: err.response.data || "Unexpected error"
        });
      });
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
          <div className="sign-up-div">
            <Button
              className="sign-up"
              onClick={this.openModal}
              word="Sign Up"
            />
            <SignUpModal
              modalIsOpen={this.state.modalIsOpen}
              closeModal={this.closeModal}
              modalMessage={this.state.modalMessage}
              newUsername={this.state.newUsername}
              newPassword={this.state.newPassword}
              newRole={this.state.newRole}
              newName={this.state.newName}
              handleChange={this.handleChange}
              signupClick={this.signupClick}
            />
          </div>
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
