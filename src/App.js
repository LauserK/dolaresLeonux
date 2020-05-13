import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";

//Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signout from "./pages/signout";

//Actions
import { setCurrentUser } from "./redux/user/user.actions";

class App extends Component {
  componentDidMount() {
    // if exists a session we set to the state
    let user = localStorage.getItem("userLeonux");
    if (user) {
      this.props.setCurrentUser(JSON.parse(user));
    }
  }
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            this.props.currentUser ? <Home /> : <Redirect to="/login" />
          }
        />
        <Route
          exact
          path="/login"
          render={() =>
            this.props.currentUser ? <Redirect to="/" /> : <Login />
          }
        />
        <Route
          exact
          path="/logout"
          render={() => (this.props.currentUser ? <Signout /> : <Login />)}
        />
      </Switch>
    );
  }
}

const mapStateToProps = ({ user, app }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
