import React, { Component } from "react";
import "./App.css";

const API = "http://10.10.0.250/DolaresLeonux/api/";
//const API = "http://localhost:2114/api/";
const DB = "00000002";

class App extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      totalBs: 0,
      totalDolares: 0,
      account: "",
      isLoading: false,
      buttonsEnable: false
    };
  }

  handleSearch = e => {
    e.preventDefault();

    this.setState(
      {
        ...this.state,
        isLoading: true
      },
      () => {
        fetch(`${API}article/${this.state.account}/?db=${DB}`)
          .then(res => res.json())
          .then(res => {
            if (!res.error) {
              if (res.data.length == 0) return alert("Cuenta vacia");
              let totalBs = 0;
              let totalDolares = 0;

              res.data.map(article => {
                totalBs = totalBs + article.Price;
                totalDolares = totalDolares + article.PriceUsd;
              });

              this.setState({
                ...this.state,
                articles: res.data,
                totalBs: totalBs,
                totalDolares: totalDolares,
                buttonsEnable: true,
                isLoading: false
              });
            } else {
              this.setState(
                {
                  ...this.state,
                  isLoading: false
                },
                () => {
                  alert(res.description);
                }
              );
            }
          });
      }
    );
  };

  handleProcess = type => {
    this.setState(
      {
        ...this.state,
        buttonsEnable: false,
        isLoading: true
      },
      () => {
        fetch(`${API}article/${this.state.account}/${type}/?db=${DB}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        })
          .then(res => res.json())
          .then(res => {
            if (res.error === false) {
              this.setState(
                {
                  articles: [],
                  totalBs: 0,
                  totalDolares: 0,
                  account: "",
                  isLoading: false
                },
                () => alert("Procesado")
              );
            }
          });
      }
    );
  };

  handleSubmit = e => {
    e.preventDefault();

    this.handleProcess("0");
  };

  handleSubmitWithoutPay = e => {
    e.preventDefault();
    this.handleProcess("1");
  };

  handleChange = e => {
    this.setState({
      ...this.state,
      account: e.target.value
    });
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row valign-wrapper">
            <div className="input-field col s10">
              <input
                className="validate"
                type="number"
                name="account"
                id="account"
                onChange={this.handleChange}
                value={this.state.account}
              />
              <label htmlFor="account">Ingresa la cuenta</label>
            </div>
            <a
              className="waves-effect waves-light btn col s2"
              onClick={this.handleSearch}
              href="#"
            >
              BUSCAR
            </a>
          </div>
          <div className="row tabla">
            <table className="striped responsive-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio Bs</th>
                  <th>Precio $</th>
                </tr>
              </thead>
              <tbody>
                {this.state.articles.map(article => (
                  <tr key={article.Name}>
                    <td>{article.Name}</td>
                    <td>{article.Quantity}</td>
                    <td>Bs {article.Price}</td>
                    <td>${article.PriceUsd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <p className="right-align">
              <b>Total Bs: </b> {this.state.totalBs}
            </p>
            <p className="right-align">
              <b>Total $: </b> {this.state.totalDolares}
            </p>
          </div>

          <div className="row">
            <a
              className="waves-effect waves-light btn col s5"
              onClick={this.handleSubmit}
              disabled={this.state.buttonsEnable ? false : true}
            >
              PROCESAR
            </a>
            <a
              className="waves-effect waves-light btn col s5 right"
              onClick={this.handleSubmitWithoutPay}
              disabled={this.state.buttonsEnable ? false : true}
            >
              PROCESAR SIN PAGO
            </a>
          </div>

          {this.state.isLoading ? (
            <div className="progress">
              <div className="indeterminate"></div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
