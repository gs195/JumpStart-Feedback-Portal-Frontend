import React from "react";
import "../styles/App.css";
import axios from "axios";
import Container from "./Container";

const categories = { good: "good", suggest: "suggest", improve: "improve" };

class Feedback2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      feedbackItems: [],
      username: "",
      password: "",
      session: "react",
      fieldValue: [
        { value: "", category: categories.good },
        { value: "", category: categories.suggest },
        { value: "", category: categories.improve }
      ]
    };
  }

  getFeedback() {
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

  componentDidMount() {
    this.getFeedback();
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
        this.setState({
          fieldValue: newFieldValueArray,
          display: myData
        });
        this.getFeedback();
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

  spanClickHandler = (event, id) => {
    let confirmation = window.confirm(
      "Are you sure you want to delete this task?"
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
        console.log(myData)
        this.setState({
          display: myData
        });
        this.getFeedback();
      })
      .catch(err => {
        console.log(err);
        console.log(err.response.message);
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
        {/* <header className="App-header"> */}
        <div className="bulk-container">{containerListByCategorty()}</div>
        {/* </header> */}
      </div>
    );
  }
}

export default Feedback2;
