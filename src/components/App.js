import React from "react";
import Button from "./Button";
import Input from "./Input";
import "../styles/App.css";
import axios from "axios";

class FeedbackApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      fieldValueA: "",
      fieldValueB: ""
    };
    this.host = "http://localhost:3000";
  }

  handleNewInputA = event => {
    let newArray = event.target.value;
    this.setState({ fieldValueA: newArray });
  };

  handleNewInputB = event => {
    let newArray = event.target.value;
    this.setState({ fieldValueB: newArray });
  };

  loginClick = async () => {
    let myData;
    let myResult;
    // let myStatus;
    if (this.state.fieldValueA === "" || this.state.fieldValueB === "") {
      return;
    }
    const gotItem = sessionStorage.getItem("JWT");
    if (!gotItem) {
      try {
        await axios
          .post(`${this.host}/jwt/login`, {
            username: this.state.fieldValueA,
            password: this.state.fieldValueB
          })
          .then(response => {
            myData = response.data;
            sessionStorage.setItem("JWT", myData.token);
            return this.setState({
              fieldValueA: "",
              fieldValueB: "",
              display: "Logged in successfully"
            });
          });
      } catch (err) {
        console.log(err);
        myResult = "Incorrect login details";
        return this.setState({
          fieldValueA: "",
          fieldValueB: "",
          display: myResult
        });
      }
    } else {
      return this.setState({
        fieldValueA: "",
        fieldValueB: "",
        display: "Already logged in"
      });
    }
    let headers = { Authorization: "Bearer " + String(myData.token) };
    try {
      await axios({
        method: "get",
        url: `${this.host}/feedback`,
        headers
      }).then(response => {
        myResult = response.data;
      });
    } catch (err) {
      console.log(err);
      myResult = err.message;
      return this.setState({
        fieldValueA: "",
        fieldValueB: "",
        display: myResult
      });
    }

    return this.setState({
      fieldValueA: "",
      fieldValueB: "",
      display: myResult
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="LogIn">
            <Input
              className="username"
              type="text"
              value={this.state.fieldValueA}
              placeholder={`username...`}
              onChange={event => this.handleNewInputA(event)}
            />
            <Input
              className="password"
              type="text"
              value={this.state.fieldValueB}
              placeholder={`password..`}
              onChange={event => this.handleNewInputB(event)}
            />
            <Button
              className="submit"
              type="Button"
              onClick={this.loginClick}
            />
          </div>
          <div className="resultDiv">
            <p className="resultText">{JSON.stringify(this.state.display)}</p>
          </div>
        </header>
      </div>
    );
  }
}

function App() {
  return <FeedbackApp />;
}

export default App;
