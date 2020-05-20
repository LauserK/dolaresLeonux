import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API } from "../const";

class SalesDetail extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
    };
  }

  handleFetchSales = () => {
    const { currentUser, match } = this.props;
    const { DB } = currentUser;

    this.setState(
      {
        ...this.state,
        isLoading: true,
      },
      () => {
        fetch(`${API}sales/${match.params.IdSale}/?db=${DB}`)
          .then((res) => res.json())
          .then((res) => {
            if (res.error === false) {
              this.setState({
                ...this.state,
                articles: res.data,
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
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {this.state.articles.map((article) => (
                <tr key={article.Auto}>
                  <th>{article.Name}</th>
                  <th>{article.Quantity}</th>
                  <th>{article.Price}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          className="waves-effect waves-light orange btn col s2"
          to="/sales/"
        >
          Regresar
        </Link>
      </div>
    );
  }
}
const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, null)(SalesDetail);
