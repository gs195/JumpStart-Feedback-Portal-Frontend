import React from "react";
import axios from "axios";

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      display: ""
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

  render() {
    return (
      <div>
        <p className="resultText">
          {this.props.display + JSON.stringify(this.state.display)}
        </p>
      </div>
    );
  }
}
export default Feedback;
