import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API } from "../const";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      client: {
        id: "",
        name: "",
        birthday: "",
        location: "",
        email: "",
        phone: "",
        created: true,
      },
      totalBs: 0,
      totalDolares: 0,
      account: "",
      isLoading: false,
      buttonsEnable: false,
      tasa: 0,
      custom: false,
    };
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { DB } = this.props.currentUser;
    this.setState(
      {
        ...this.state,
        isLoading: true,
        articles: [],
      },
      () => {
        fetch(`${API}article/${this.state.account}/?db=${DB}`)
          .then((res) => res.json())
          .then((res) => {
            if (res.error === false) {
              if (res.data[0].articles.length == 0)
                return alert("Cuenta vacia");
              let totalBs = 0;
              let totalDolares = 0;

              res.data[0].articles.map((article) => {
                totalBs = totalBs + article.Price;
                totalDolares = totalDolares + article.PriceUsd;
              });

              this.setState({
                ...this.state,
                articles: res.data[0].articles,
                tasa: res.data[0].tasa,
                totalBs: totalBs,
                totalDolares: totalDolares,
                buttonsEnable: true,
                isLoading: false,
              });
            } else {
              this.setState(
                {
                  ...this.state,
                  isLoading: false,
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

  handleProcess = (type) => {
    const { DB } = this.props.currentUser;
    this.setState(
      {
        ...this.state,
        buttonsEnable: false,
        isLoading: true,
      },
      () => {
        fetch(`${API}article/${this.state.account}/${type}/?db=${DB}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res.error === false) {
              this.setState(
                {
                  articles: [],
                  client: {
                    id: "",
                    name: "",
                    birthday: "",
                    location: "",
                    email: "",
                    phone: "",
                    created: true,
                  },
                  totalBs: 0,
                  totalDolares: 0,
                  account: "",
                  isLoading: false,
                  buttonsEnable: false,
                  tasa: 0,
                  custom: false,
                },
                () => alert("Procesado")
              );
            } else {
              this.setState(
                {
                  ...this.state,
                  isLoading: false,
                },
                () => alert(res.description)
              );
            }
          });
      }
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.handleProcess("0");
  };

  handleSubmitWithoutPay = (e) => {
    e.preventDefault();
    if (this.props.currentUser.Administrator) {
      this.handleProcess("1");
    }
  };

  handleSubmitDelivery = (e) => {
    e.preventDefault();
    if (this.props.currentUser.Administrator) {
      this.handleProcess("2");
    }
  };

  handleSubmitPickUp = (e) => {
    e.preventDefault();
    if (this.props.currentUser.Administrator) {
      this.handleProcess("3");
    }
  };

  handleChange = (e) => {
    this.setState({
      ...this.state,
      account: e.target.value,
    });
  };

  handleClientChange = (e) => {
    //cuando se modifica un input
    const { value, name } = e.target;
    if (name === "id") {
      const size = this.state.client.id.length;
      const types = ["V", "E", "J", "G"];
      if (size === 0) {
        if (types.indexOf(value.toUpperCase()) == -1) {
          alert("Debe de ser un tipo valido (V|E|J|G)");
        }
        this.setState({
          ...this.state,
          client: {
            ...this.state.client,
            [name]: value.toUpperCase(),
          },
        });
      } else {
        this.setState({
          ...this.state,
          client: {
            ...this.state.client,
            [name]: value,
          },
        });
      }
    } else {
      this.setState({
        ...this.state,
        client: {
          ...this.state.client,
          [name]: value,
        },
      });
    }
  };

  handleCustom = (e) => {
    this.setState({
      ...this.state,
      custom: !this.state.custom,
      client: {
        id: "",
        name: "",
        birthday: "",
        email: "",
        phone: "",
        created: true,
      },
    });
  };

  handleClientSearch = (e) => {
    e.preventDefault();
    const { DB } = this.props.currentUser;
    this.setState(
      {
        ...this.state,
        isLoading: true,
      },
      () => {
        fetch(`${API}client/${this.state.client.id}/?db=${DB}`)
          .then((res) => res.json())
          .then((res) => {
            if (res.error === false) {
              this.setState({
                ...this.state,
                isLoading: false,
                client: {
                  id: res.data[0].IdentificationNumber,
                  name: res.data[0].Name,
                  birthday: res.data[0].Birthday,
                  email: res.data[0].Email,
                  phone: res.data[0].Phone,
                  created: true,
                },
              });
            } else {
              if (res.description === "client doesn't exists!") {
                if (
                  window.confirm(
                    "El cliente con la identificación indicada no existe\n¿Deseas crear el cliente?"
                  )
                ) {
                  this.setState({
                    ...this.state,
                    client: {
                      ...this.state.client,
                      name: "",
                      birthday: "",
                      location: "",
                      email: "",
                      phone: "",
                      created: false,
                    },
                    isLoading: false,
                  });
                } else {
                  this.setState({
                    ...this.state,
                    isLoading: false,
                  });
                }
              } else {
                this.setState(
                  {
                    ...this.state,
                    isLoading: false,
                  },
                  () => {
                    alert(res.description);
                  }
                );
              }
            }
          });
      }
    );
  };

  handleCreateClient = (e) => {
    e.preventDefault();
    const { DB } = this.props.currentUser;
    const { id, name, birthday, location, phone, email } = this.state.client;
    this.setState(
      {
        ...this.state,
        isLoading: true,
      },
      () => {
        if (id !== "" && name !== "") {
          // post login to server
          fetch(`${API}client/?db=${DB}`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Code: id,
              IdentificationNumber: id,
              Name: name,
              Direccion: location,
              Phone: phone,
              Email: email,
              Birthday: birthday,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.error) {
                if (res.description === "Client created successfully") {
                  this.setState({
                    ...this.state,
                    isLoading: false,
                    client: {
                      ...this.state.client,
                      created: true,
                    },
                  });
                }
              } else {
                this.setState(
                  {
                    ...this.state,
                    isLoading: false,
                  },
                  () => {
                    alert("Error creando el cliente!\n" + res.description);
                  }
                );
              }
            });
        } else {
          this.setState({ ...this.state, isLoading: false }, () => {
            alert("Verificar datos faltantes!");
          });
        }
      }
    );
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
              className="waves-effect waves-light orange btn col s2"
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
                {this.state.articles.map((article) => (
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
            <p className="right-align">
              <b>Tasa de cambio: </b> {this.state.tasa}
            </p>
          </div>

          <div className="row">
            <div className="row">
              <a
                className="waves-effect waves-light orange btn col s4 m2"
                onClick={this.handleCustom}
                href="#"
                style={{ marginLeft: 0 }}
                disabled={this.state.buttonsEnable ? false : true}
              >
                {this.state.custom ? "No Personalizada" : "Personalizada"}
              </a>
            </div>
            <div className={`row ${this.state.custom ? null : "hide"}`}>
              <div className="row valign-wrapper">
                <div
                  className="input-field col s8 m5"
                  style={{ marginLeft: 0 }}
                >
                  <input
                    type="text"
                    name="id"
                    id="id"
                    onChange={this.handleClientChange}
                    value={this.state.client.id}
                  />
                  <label
                    htmlFor="id"
                    className={this.state.client.id !== "" ? "active" : ""}
                  >
                    Ingresa Doc del cliente (Ej: V26392347)
                  </label>
                </div>
                <a
                  className="waves-effect waves-light orange btn col s4 m2"
                  onClick={this.handleClientSearch}
                  href="#"
                  style={{ marginLeft: 0 }}
                >
                  BUSCAR
                </a>
              </div>
              <div className="row">
                <div
                  className="input-field col s8 m3"
                  style={{ marginLeft: 0 }}
                >
                  <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={this.handleClientChange}
                    value={this.state.client.name}
                    disabled={this.state.client.created ? true : false}
                  />
                  <label
                    htmlFor="name"
                    className={this.state.client.name !== "" ? "active" : ""}
                  >
                    Nombre y Apellido del Cliente
                  </label>
                </div>
                <div
                  className="input-field col s8 m2"
                  style={{ marginLeft: 0 }}
                >
                  <input
                    type="text"
                    name="birthday"
                    id="birthday"
                    onChange={this.handleClientChange}
                    value={this.state.client.birthday}
                    disabled={this.state.client.created ? true : false}
                  />
                  <label
                    htmlFor="birthday"
                    className={
                      this.state.client.birthday !== "" ? "active" : ""
                    }
                  >
                    Fecha de nacimiento (dd/mm/yyyy)
                  </label>
                </div>
                <div
                  className="input-field col s8 m3"
                  style={{ marginLeft: 0 }}
                >
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={this.handleClientChange}
                    value={this.state.client.email}
                    disabled={this.state.client.created ? true : false}
                  />
                  <label
                    htmlFor="email"
                    className={this.state.client.email !== "" ? "active" : ""}
                  >
                    Correo
                  </label>
                </div>
                <div
                  className="input-field col s8 m3"
                  style={{ marginLeft: 0 }}
                >
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    onChange={this.handleClientChange}
                    value={this.state.client.phone}
                    disabled={this.state.client.created ? true : false}
                  />
                  <label
                    htmlFor="phone"
                    className={this.state.client.phone !== "" ? "active" : ""}
                  >
                    Telefono
                  </label>
                </div>
                <div
                  className="input-field col s12 m6"
                  style={{ marginLeft: 0 }}
                >
                  <input
                    type="text"
                    name="location"
                    id="location"
                    onChange={this.handleClientChange}
                    value={this.state.client.location}
                    disabled={this.state.client.created ? true : false}
                  />
                  <label
                    htmlFor="location"
                    className={
                      this.state.client.location !== "" ? "active" : ""
                    }
                  >
                    Dirección
                  </label>
                </div>
                <a
                  className={`waves-effect waves-light orange btn col s12 m6 ${
                    this.state.client.created ? "hide" : null
                  }`}
                  onClick={this.handleCreateClient}
                  href="#"
                  style={{ marginLeft: 0 }}
                  disabled={this.state.client.created ? true : false}
                >
                  CREAR CLIENTE
                </a>
              </div>
            </div>
          </div>

          <div className="row">
            <a
              className="waves-effect waves-light orange btn col s3"
              onClick={this.handleSubmit}
              disabled={this.state.buttonsEnable ? false : true}
            >
              PAGO DIVISAS
            </a>
            {this.props.currentUser.Administrator ? (
              <a
                className="waves-effect waves-light orange btn col s3"
                onClick={this.handleSubmitDelivery}
                disabled={this.state.buttonsEnable ? false : true}
              >
                DELIVERY
              </a>
            ) : null}
            {this.props.currentUser.Administrator ? (
              <a
                className="waves-effect waves-light orange btn col s3"
                onClick={this.handleSubmitPickUp}
                disabled={this.state.buttonsEnable ? false : true}
              >
                TO PICK-UP
              </a>
            ) : null}
            {this.props.currentUser.Administrator ? (
              <a
                className="waves-effect waves-light orange btn col s3 right"
                onClick={this.handleSubmitWithoutPay}
                disabled={this.state.buttonsEnable ? false : true}
              >
                PROCESAR SIN PAGO
              </a>
            ) : null}
          </div>
          <div className="row">
            <Link
              className="waves-effect waves-light orange btn col s2"
              to="/logout/"
            >
              Salir
            </Link>
            {this.props.currentUser.Administrator ? (
              <Link
                className="waves-effect waves-light orange btn col s2"
                to="/sales/"
              >
                Ventas
              </Link>
            ) : null}
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

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, null)(Home);
