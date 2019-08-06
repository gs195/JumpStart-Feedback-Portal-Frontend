import React from "react";
import "../styles/App.css";
import axios from "axios";
import Container from "./Container";
import Input from "./Input";
import generateID from "../generateID";
import isInstructor from "../isInstructor";
import Archive from "./Archive";

const categories = { good: "good", suggest: "suggest", improve: "improve" };

class Feedback2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      feedbackItems: [],
      //   session: "",
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
    if (!gotItem) {
      return this.setState({
        display: "Please log in"
      });
    }
    let headers = { Authorization: "Bearer " + String(gotItem) };
    axios({
      method: "get",
      url: `${process.env.REACT_APP_HOST}/feedback`,
      headers
    })
      .then(response => {
        myResult = response.data;
        this.setState({
          feedbackItems: myResult.fbItems,
          isInstructor: isInstructor(myResult.userRole),
          clientName: myResult.userName,
          clientId: myResult.userId,
          display: "system online"
        });
      })
      .catch(err => {
        return this.setState({
          feedbackItems: [],
          display: err.message || "system online"
        });
      });
    axios({
      method: "get",
      url: `${process.env.REACT_APP_HOST}/session`,
      headers
    })
      .then(response => {
        myResult = response.data;
        this.setState({
          sessionInputFieldValue: myResult.session,
          instructor: myResult.instructor
        });
      })
      .catch(err => {
        return this.setState({
          display: err.message,
          sessionInputFieldValue: ""
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
    this.setState({ display: "Submitting your feedback..." });
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
        session: this.state.sessionInputFieldValue,
        category: theCategory
      },
      headers
    })
      .then(response => {
        const newFieldValueArray = this.state.fieldValue.map(field => {
          if (field.category === theCategory) {
            field.value = "";
          }
          return field;
        });
        this.setState({
          fieldValue: newFieldValueArray,
          display: response.data,
          feedbackItems: newFeedbackItemsArray
        });
      })
      .catch(err => {
        return this.setState({ display: err.response.data });
      });
  };

  handleEnterNewSession = event => {
    let enterKeyCode = 13;
    if (event.keyCode !== enterKeyCode || event.target.value === "") return;
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
        this.setState({ display: response.data });
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
    this.setState({ display: "Deleting feedback..." });
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

  archiveClick = () => {
    this.setState({ display: "Seeking permission to archive..." });
    const gotItem = sessionStorage.getItem("JWT");
    let headers = { Authorization: "Bearer " + String(gotItem) };
    axios({
      method: "post",
      url: `${process.env.REACT_APP_HOST}/feedback/archive`,
      headers
    })
      .then(response => {
        this.setState({
          display: response.data,
          feedbackItems: []
        });
      })
      .catch(err => {
        return this.setState({ display: err.response.data });
      });
  };

  render() {
    const fbDocumentListByCategory = inputCategory =>
      this.state.feedbackItems.filter(
        document => document.category === inputCategory
      );

    return (
      <div className="App">
        <div className="sign-in">
          <Archive archiveClick={this.archiveClick} />
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
          placeholder={`Session ${this.state.sessionInputFieldValue}`}
          onChange={this.handleNewSessionInput}
          disabled={this.state.isInstructor ? false : true}
        />
        <div className="bulk-container">
          {Object.keys(categories).map((cat, idx) => {
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
          })}
        </div>
      </div>
    );
  }
}

export default Feedback2;
