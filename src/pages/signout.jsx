import React, { Component } from "react";
import { connect } from "react-redux";
//import { Redirect } from "react-router-dom";
import { setCurrentUser } from "../redux/user/user.actions";

class Signout extends Component {
  render() {
    console.log(this.props.currentUser);
    if (this.props.currentUser) {
      localStorage.removeItem("userLeonux");
      this.props.setCurrentUser(null);
    } else {
      this.props.history.push("/login");
    }
    return <div>Por favor espere...</div>;
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signout);
