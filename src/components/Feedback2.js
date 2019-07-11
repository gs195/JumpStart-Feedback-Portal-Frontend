import React from "react";
import "../styles/App.css";
import axios from "axios";
import Container from "./Container";
import Input from "./Input";
import generateID from "../generateID";

const categories = { good: "good", suggest: "suggest", improve: "improve" };

class Feedback2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "system online",
      feedbackItems: [],
      session: "",
      fieldValue: [
        { value: "", category: categories.good },
        { value: "", category: categories.suggest },
        { value: "", category: categories.improve }
      ],
      isInstructor: false,
      instructor: "",
      sessionInputFieldValue: "",
      clientName: "",
      clientId: ""
    };
  }

  getFeedbackAndSession() {
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
        const isInstructor = type => {
          if (type === "Instructor") {
            return true;
          } else {
            return false;
          }
        };
        this.setState({
          feedbackItems: myResult.fbItems,
          isInstructor: isInstructor(myResult.userRole),
          clientName: myResult.userName,
          clientId: myResult.userId
        });
      })
      .catch(error => {
        return this.setState({
          feedbackItems: [],
          display: error.response.data || "system online"
        });
      });
    axios({
      method: "get",
      url: `${process.env.REACT_APP_HOST}/session`,
      headers
    })
      .then(response => {
        myResult = response.data;
        console.log("myResult is", myResult);
        this.setState({
          session: myResult.session,
          instructor: myResult.instructor
        });
      })
      .catch(err => {
        console.log(err);
        return this.setState({
          session: ""
        });
      });
  }

  componentDidMount() {
    this.getFeedbackAndSession();
  }

  handleNewInput = (event, theCategory) => {
    let newArray = this.state.fieldValue.map(obj => {
      if (obj.category === theCategory) {
        obj.value = event.target.value;
      }
      return obj;
    });
    this.setState({ fieldValue: newArray });
  };

  handleNewSessionInput = event => {
    this.setState({ sessionInputFieldValue: event.target.value });
  };

  handleEnterPress = (event, theCategory) => {
    let enterKeyCode = 13;
    if (event.keyCode !== enterKeyCode || event.target.value === "") return;
    let myData;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };

    const inputFieldValue = this.state.fieldValue.filter(
      elem => elem.category === theCategory
    );
    const newFeedbackItemsArray = [
      ...this.state.feedbackItems,
      {
        text: inputFieldValue[0].value,
        category: theCategory,
        _id: generateID()
      }
    ];

    axios({
      method: "post",
      url: `${process.env.REACT_APP_HOST}/feedback`,
      data: {
        text: event.target.value, //needs to change to a state variable
        session: this.state.session,
        category: theCategory
      },
      headers
    })
      .then(response => {
        console.log("ab[0]", inputFieldValue[0]);
        myData = response.data;
        const newFieldValueArray = this.state.fieldValue.map(field => {
          if (field.category === theCategory) {
            field.value = "";
          }
          return field;
        });
        this.setState({
          fieldValue: newFieldValueArray,
          display: myData,
          feedbackItems: newFeedbackItemsArray
        });
        // this.getFeedback();
      })
      .catch(err => {
        console.log(err);
        return this.setState({ display: err.response.data });
      });
  };

  handleEnterNewSession = event => {
    let enterKeyCode = 13;
    if (event.keyCode !== enterKeyCode || event.target.value === "") return;
    let myData;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    axios({
      method: "post",
      url: `${process.env.REACT_APP_HOST}/session`,
      data: {
        session: this.state.sessionInputFieldValue
      },
      headers
    })
      .then(response => {
        // myData = response.data;
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
        return this.setState({ display: err.response.data });
      });
  };

  handleInputField = theCategory => {
    let newFieldValueArray = this.state.fieldValue.filter(
      obj => obj.category === theCategory
    );
    return newFieldValueArray[0].value;
  };

  spanClickHandler = (event, id) => {
    let myData;
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    let textToDelete = this.state.feedbackItems.filter(item => {
      return item._id === id;
    });
    const itemsToKeep = this.state.feedbackItems.filter(item => {
      return item._id !== id;
    });
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_HOST}/feedback`,
      data: { text: textToDelete[0].text, category: textToDelete[0].category },
      headers
    })
      .then(response => {
        myData = response.data;
        console.log(myData);
        this.setState({
          display: myData,
          feedbackItems: itemsToKeep
        });
        // this.getFeedback();
      })
      .catch(err => {
        this.setState({
          display: err.response.data || "system online"
        });
      });
  };

  render() {
    //filters this.state.feedbackItems to return an array of feedback documents with category = input parameter category
    const fbDocumentListByCategory = inputCategory =>
      this.state.feedbackItems.filter(
        document => document.category === inputCategory
      );

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
        <div className="sign-in">
          <div className="outcome">{this.state.display}</div>
        </div>
        <div className="instructor-container">
          <p className="clientName">
            {this.state.clientName ? `Welcome ${this.state.clientName}!` : ""}
          </p>
          <p className="sessionInstructor">{`Instructor ${
            this.state.instructor
          }`}</p>
        </div>
        <Input
          className="sessionInputDiv"
          type="text"
          value={this.state.sessionInputFieldValue}
          onKeyDown={this.handleEnterNewSession}
          placeholder={`Session ${this.state.session}`}
          onChange={this.handleNewSessionInput}
          disabled={this.state.isInstructor ? false : true}
        />
        <div className="bulk-container">{containerListByCategorty()}</div>
      </div>
    );
  }
}

export default Feedback2;
