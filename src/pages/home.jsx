import React, { Component } from "react";
import { connect } from "react-redux";

class Home extends Component {}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps, null)(Home);
