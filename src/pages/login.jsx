import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { API } from "../const";

// set current user action
import { setCurrentUser } from "../redux/user/user.actions";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      db: "00000001",
      isLoading: false
    };
  }
  handleSubmit = async e => {
    e.preventDefault();
    const { username, password, db } = this.state;
    if (username != "" && password != "") {
      this.setState({ ...this.state, isLoading: true }, () => {
        // post login to server
        fetch(`${API}login/?db=${db}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            Username: username,
            Password: password
          })
        })
          .then(res => res.json())
          .then(res => {
            if (res.error) {
              alert(res.description);
            } else {
              localStorage.setItem("userLeonux", JSON.stringify(res.data[0]));
              this.props.setCurrentUser(res.data[0]);
            }

            this.setState({
              username: "",
              password: "",
              db: "00000001",
              isLoading: false
            });
          })
          .catch(err => console.log(err));
      });
    } else {
      alert("Usuario o contraseña vacios");
    }
  };

  handleChange = e => {
    //cuando se modifica un input
    const { value, name } = e.target;
    this.setState({
      ...this.state,
      [name]: value
    });
  };

  componentDidMount() {
    // exists user logged we redirect to home
    if (this.props.currentUser) {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="container">
        <form className="col s12" method="post" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col s12"></div>
          </div>
          {this.state.isLoading ? (
            <div className="progress">
              <div className="indeterminate"></div>
            </div>
          ) : null}

          <div className="row">
            <div className="col s12">
              <label>Empresa</label>
              <select
                name="db"
                id="db"
                className="browser-default"
                onChange={this.handleChange}
              >
                <option value="00000001" defaultValue>
                  Panadería
                </option>
                <option value="00000002">Restaurante</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="text"
                name="username"
                id="username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <label htmlFor="username">Ingresa tu usuario</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="password"
                name="password"
                id="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
              <label htmlFor="password">Ingresa tu contraseña</label>
            </div>
          </div>

          <br />
          <center>
            <div className="row">
              <button
                type="submit"
                name="btn_login"
                className="col s12 btn btn-large waves-effect orange"
              >
                Entrar
              </button>
            </div>
          </center>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
