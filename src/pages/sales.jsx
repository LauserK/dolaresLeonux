import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API } from "../const";

class Sales extends Component {
  constructor() {
    super();
    this.state = {
      sales: [],
      pagination: { next: false, previous: false, page: 1 },
    };
  }

  handleNextPage = (e) => {
    e.preventDefault();
    this.setState(
      {
        ...this.state,
        pagination: {
          page: this.state.pagination.page + 1,
          next: this.state.sales.length > 0 ? true : false,
          previous: this.state.pagination.page > 1 ? true : false,
        },
      },
      () => {
        this.handleFetchSales();
      }
    );
  };

  handlePreviousPage = (e) => {
    e.preventDefault();
    this.setState(
      {
        ...this.state,
        pagination: {
          page: this.state.pagination.page - 1,
          next: this.state.sales.length > 0 ? true : false,
          previous: this.state.pagination.page > 1 ? true : false,
        },
      },
      () => {
        this.handleFetchSales();
      }
    );
  };

  handleFetchSales = () => {
    const { DB } = this.props.currentUser;
    const { page } = this.state.pagination;
    this.setState(
      {
        ...this.state,
        isLoading: true,
      },
      () => {
        fetch(`${API}sales/?db=${DB}&p=${page}&i=15`)
          .then((res) => res.json())
          .then((res) => {
            if (res.error === false) {
              this.setState({
                ...this.state,
                sales: res.data,
                isLoading: false,
                pagination: {
                  ...this.state.pagination,
                  next: true,
                  previous: this.state.pagination.page > 1 ? true : false,
                },
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

  componentDidMount() {
    this.handleFetchSales();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <table className="striped responsive-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Razon Social</th>
                <th>RIF/CI</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {this.state.sales.map((sale) => (
                <tr key={sale.Auto}>
                  <td>
                    <Link to={`/sales/${sale.Auto}`}>{sale.Document}</Link>
                  </td>
                  <td>{sale.Date}</td>
                  <td>{sale.Total}</td>
                  <td>{sale.Name}</td>
                  <td>{sale.RIF}</td>
                  <td>{sale.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row">
            <a
              className="waves-effect waves-light orange btn col s3"
              onClick={this.handlePreviousPage}
              disabled={this.state.pagination.previous ? false : true}
            >
              Anterior
            </a>
            <a
              className="waves-effect waves-light orange btn col s3"
              onClick={this.handleNextPage}
              disabled={this.state.pagination.next ? false : true}
            >
              Siguiente
            </a>
          </div>
          <div className="row">
            <Link className="waves-effect waves-light orange btn col s2" to="/">
              Regresar
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, null)(Sales);
