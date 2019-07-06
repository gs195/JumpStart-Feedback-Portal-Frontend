import React from "react";
import Button from "./Button";
import Input from "./Input";
import "../styles/App.css";
import axios from "axios";
import Login from "./login";
// import Feedback from "./feedback";
import Container from "./Container";

const categories = { good: "good", suggest: "suggest", improve: "improve" };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      feedbackItems: [],
      username: "",
      password: "",
      // enterFeedback: "",
      session: "react",
      fieldValue: [
        { value: "", category: categories.good },
        { value: "", category: categories.suggest },
        { value: "", category: categories.improve }
      ]
    };
  }

  componentDidMount() {
    let myResult;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    axios({
      method: "get",
      url: `${process.env.REACT_APP_HOST}/feedback`,
      headers
    })
      .then(response => {
        myResult = response.data;

        this.setState({
          username: "",
          password: "",
          feedbackItems: myResult
        });
      })
      .catch(err => {
        console.log(err);
        return this.setState({
          username: "",
          password: "",
          feedbackItems: []
        });
      });
  }

  callbackFromAppComponent = dataFromChild => {
    console.log("dataFromChild", dataFromChild);
    this.setState({ feedbackItems: dataFromChild });
  };

  handleNewUsername = event => {
    this.setState({ username: event.target.value });
  };

  handleNewPassword = event => {
    this.setState({ password: event.target.value });
  };

  // handleNewFeedback = (event, theCategory) => {
  //   const sentence = event.target.value;
  //   const session = this.state.session
  //   this.setState({ enterFeedback: event.target.value });
  // };

  //same as handleNewFeedback
  handleNewInput = (event, theCategory) => {
    let newArray = this.state.fieldValue.map(obj => {
      if (obj.category === theCategory) {
        obj.value = event.target.value;
      }
      return obj;
    });
    this.setState({ fieldValue: newArray });
  };
  handleEnterPress = (event, theCategory) => {
    let enterKeyCode = 13;
    if (event.keyCode !== enterKeyCode || event.target.value === "") return;
    let myData;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    axios({
      method: "post",
      url: `${process.env.REACT_APP_HOST}/feedback`,
      data: {
        text: event.target.value,
        session: this.state.session,
        category: theCategory
      },
      headers
    })
      .then(response => {
        myData = response.data;
        const newFieldValueArray = this.state.fieldValue.map(field => {
          if (field.category === theCategory) {
            field.value = "";
          }
          return field;
        });
        return this.setState({
          fieldValue: newFieldValueArray,
          display: myData
        });
      })
      .catch(err => {
        console.log(err);
        return this.setState({ display: err.response.data });
      });
  };

  handleInputField = theCategory => {
    let newFieldValueArray = this.state.fieldValue.filter(
      obj => obj.category === String(theCategory)
    );
    return newFieldValueArray[0].value;
  };

  logoutClick = async () => {
    sessionStorage.removeItem("JWT");
    this.setState({ display: "Logged out" });
  };

  loginClick = () => {
    let myData;
    // let myStatus;
    if (this.state.username === "" || this.state.password === "") {
      return;
    }
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
          console.log("entered if !gotItem", myData);
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

  spanClickHandler = (event, id) => {
    console.log("id is", id);
    let confirmation = window.confirm(
      "Are you sure you want to delete this task? You cannot undo this action."
    );
    if (!confirmation) {
      return;
    }
    let myData;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_HOST}/feedback/${id}`,
      headers
    })
      .then(response => {
        myData = response.data;
        console.log("entered delete", myData);
        this.setState({
          display: myData
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          display: err.response.message
        });
      });
  };

  render() {
    //filters this.state.feedbackItems to return an array of feedback documents with category = input parameter category
    const fbDocumentListByCategory = inputCategory =>
      this.state.feedbackItems.filter(
        document => document.category === inputCategory
      );

    // console.log("fbDocumentListByCategory is: ", fbDocumentListByCategory);

    //obtains an array of category keys, and for each key in this array, creates a <Container> component.
    const containerListByCategorty = () => {
      const categoryKeys = Object.keys(categories);
      return categoryKeys.map((cat, idx) => {
        return (
          <Container
            key={idx}
            fbDocumentArrayByCategory={fbDocumentListByCategory(
              categories[cat]
            )}
            handleStrikethrough={this.handleStrikethrough}
            spanClickHandler={this.spanClickHandler}
            handleInputField={this.handleInputField}
            theCategory={categories[cat]}
            handleEnterPress={this.handleEnterPress}
            handleNewInput={this.handleNewInput}
          />
        );
      });
    };

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
            <div className="containerDiv">{containerListByCategorty()}</div>
            <div className="resultDiv">
              {/* <Feedback callbackFromParent={this.callbackFromAppComponent} /> */}
              <p>{JSON.stringify(this.state.display)}</p>
              <p className="resultText">
                {JSON.stringify(this.state.feedbackItems)}
              </p>
            </div>
          </div>
          <div className="createNew">
            {/* <Input
              className="createFb"
              type="text"
              value={this.state.enterFeedback}
              placeholder={`Enter feedback here...`}
              onChange={event => this.handleNewFeedback(event)}
              onKeyDown={event => this.handleEnterPress(event)}
            /> */}
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
