import React from "react";
import Button from "./Button";
import Input from "./Input";
import "../styles/App.css";
import axios from "axios";
import Login from "./login";
// import Feedback from "./feedback";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      username: "",
      password: "",
      enterFeedback: "",
      session: "react"
    };
  }

  componentDidMount() {
    let myResult;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    try {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/feedback`,
        headers
      }).then(response => {
        myResult = response.data;
        this.setState({
          username: "",
          password: "",
          display: myResult
        });
      });
    } catch (err) {
      console.log(err);
      myResult = err.message;
      return this.setState({
        username: "",
        password: "",
        display: myResult
      });
    }
  }

  handleNewUsername = event => {
    this.setState({ username: event.target.value });
  };

  handleNewPassword = event => {
    this.setState({ password: event.target.value });
  };

  handleNewFeedback = event => {
    this.setState({ enterFeedback: event.target.value });
  };

  handleEnterPress = event => {
    let enterKeyCode = 13;
    if (event.keyCode !== enterKeyCode || event.target.value === "") return;
    let myData;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    try {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_HOST}/feedback`,
        data: {
          text: this.state.enterFeedback,
          session: this.state.session,
          category: "Suggestion" //make dynamic
        },
        headers
      }).then(response => {
        myData = response.data;
        return this.setState({ enterFeedback: "", display: myData });
      });
    } catch (err) {
      console.log(err);
      return this.setState({ display: err.response.data });
      // return this.setState({ display: myData });
    }
  };

  logoutClick = async () => {
    sessionStorage.removeItem("JWT");
    this.setState({ display: "" });
  };

  loginClick = () => {
    let myData;
    // let myStatus;
    if (this.state.username === "" || this.state.password === "") {
      return;
    }
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
            display: "Logged in successfully"
          });
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
        <header className="App-header">
          <div className="LogIn">
            <Login
              username={this.state.username}
              password={this.state.password}
              handleNewUsername={this.handleNewUsername}
              handleNewPassword={this.handleNewPassword}
              loginClick={this.loginClick}
            />
            {/* <div className="resultDiv">
              <Feedback display={JSON.stringify(this.state.display)} />
            </div> */}
            <p className="resultText">
              {JSON.stringify(this.state.display)}
            </p>
          </div>
          <div className="createNew">
            <Input
              className="createFb"
              type="text"
              value={this.state.enterFeedback}
              placeholder={`Enter feedback here...`}
              onChange={event => this.handleNewFeedback(event)}
              onKeyDown={event => this.handleEnterPress(event)}
            />
            <Button
              word="Logout"
              className="logout"
              type="Button"
              onClick={this.logoutClick}
            />
          </div>
        </header>
      </div>
    );
  }
}

// function App() {
//   return <FeedbackApp />;
// }

export default App;
