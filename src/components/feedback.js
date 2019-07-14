import React from "react";
import axios from "axios";

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayFeedback: [],
      username: "",
      password: ""
      // display: ""
    };
    this.handleShowDisplay = this.handleShowDisplay.bind(this);
    // this.handleShowDisplay();
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
          displayFeedback: myResult
        });
      })
      .catch(err => {
        console.log(err);
        return this.setState({
          username: "",
          password: "",
          displayFeedback: []
        });
      });
  }

  handleShowDisplay() {
    const allFbElemsInState = [...this.state.displayFeedback];
    const textItems = allFbElemsInState.map(document => {
      return document.text;
    });
    console.log("allFbElemsInState", allFbElemsInState);
    console.log("textItems", textItems);
    this.props.callbackFromParent(allFbElemsInState);
    return;
  }

  render() {
    return (
      <div>
        {props.datas(this.state.display)}
        {/* <p className="resultText">{this.handleShowDisplay()}</p> */}
      </div>
      //   <form>
      // <p className="resultText">{this.handleShowDisplay()}</p>
      //   </form>
    );
  }
}
export default Feedback;
