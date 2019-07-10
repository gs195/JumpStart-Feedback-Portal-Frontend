import React from "react";
import Logout from "./Logout";
import "../styles/App.css";
import axios from "axios";
import Login from "./login";
// import Feedback from "./feedback";
import Feedback2 from "./Feedback2";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: ""
    };
  }

  //   componentDidUpdate(prevProps, prevState) {
  //     if(this.props.prevProps !== this.datas) {
        
  //     }
  // }

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
    }, 1000);
  };

  loginClick = () => {
    let myData;
    if (this.state.username === "" || this.state.password === "") {
      return;
    }
    const gotItem = sessionStorage.getItem("JWT");
    console.log("gotItem is", gotItem);
    if (!gotItem) {
      console.log("entered if !gotItem");
      axios
        .post(`${process.env.REACT_APP_HOST}/jwt/login`, {
          username: this.state.username,
          password: this.state.password
        })
        .then(response => {
          myData = response.data;
          console.log("response.data", myData);
          sessionStorage.setItem("JWT", myData.token);
          this.setState({
            display: "Login successful. Loading page data..."
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          this.setState({
            display: "Incorrect login details "
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
          <div className="outcome"><span>{`${this.state.display}`}</span></div>
          <Login
            username={this.state.username}
            password={this.state.password}
            handleNewUsername={this.handleNewUsername}
            handleNewPassword={this.handleNewPassword}
            loginClick={this.loginClick}
          />
        </div>
        <div>
          <Feedback2 />
        </div>
        <div className="logout-container" />
      </div>
    );
  }
}

export default App;
