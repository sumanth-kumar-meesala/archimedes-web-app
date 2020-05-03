import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import NavBar from "./NavBar";
import "../styles/AddDrug.css";
import axios from "axios";
import ReactGA from "react-ga";

class AddDrug extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drugs: [
        {
          product_name: "",
          active_ingredients: "",
          sponser_name: "",
          entry_for: "",
          phase: "",
          details: ""
        }
      ]
    };
  }

  componentDidMount() {
    document.title = "Add Drug";
    document.body.classList.add("add-drug");

    if (localStorage.getItem("access-token")) {
      this.setState({
        userLoggedIn: true
      });
    } else {
      this.setState({
        userLoggedIn: false
      });
    }

    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  handleChange = (event, i) => {
    const { name, value } = event.target;
    let drugs = [...this.state.drugs];
    drugs[i] = { ...drugs[i], [name]: value };
    this.setState({ drugs });
  };

  addNewDrug = event => {
    this.setState(prevState => ({
      drugs: [
        ...prevState.drugs,
        {
          product_name: "",
          active_ingredients: "",
          sponser_name: "",
          entry_for: "",
          phase: "",
          details: ""
        }
      ]
    }));
  };

  handleSubmit = event => {
    var self = this;

    ReactGA.event({
      category: "User",
      action: "Add a drug"
    });

    var url = "https://api-archimedes.herokuapp.com/tga/add-tga";

    var payload = {
      token: localStorage.getItem("access-token"),
      tgas: self.state.drugs
    };

    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            self.setState({ drugs: [] });
            self.setState({
              drugs: [
                {
                  product_name: "",
                  active_ingredients: "",
                  sponser_name: "",
                  entry_for: "",
                  phase: "",
                  details: ""
                }
              ]
            });
          }
        }
      })
      .catch(function(error) {});

    event.preventDefault();
  };

  logout = event => {
    ReactGA.event({
      category: "User",
      action: "Logout",
      label: localStorage.getItem("name")
    });

    localStorage.removeItem("access-token");
    localStorage.removeItem("isPremium");
    this.setState({
      userLoggedIn: false
    });

    this.props.history.push("/");
  };

  render() {
    return (
      <React.Fragment>
        <NavBar logout={this.logout} userLoggedIn={this.state.userLoggedIn} />
        <div className="add-drug-mist" />
        <center>
          <div className="drug bd-drug">
            <form
              className="login-form needs-validation"
              onSubmit={this.handleSubmit}
            >
              {this.state.drugs.map((el, i) => (
                <div className="form-group" key={i}>
                  <h4>New Drug</h4>
                  <div className="input-group mb-3">
                    <input
                      id="inpuptDrugName"
                      type="text"
                      className="form-control"
                      placeholder="Drug Name"
                      aria-label="Drug Name"
                      value={el.drugName}
                      name="product_name"
                      onChange={event => this.handleChange(event, i)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      id="inpuptActiveIngredients"
                      type="text"
                      className="form-control"
                      placeholder="Active Ingredients"
                      aria-label="Active Ingredients"
                      value={el.activeIngredients}
                      name="active_ingredients"
                      onChange={event => this.handleChange(event, i)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      id="inpuptCompany"
                      type="text"
                      className="form-control"
                      placeholder="Company"
                      aria-label="Company"
                      value={el.company}
                      name="sponser_name"
                      onChange={event => this.handleChange(event, i)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      id="inpuptEntryFor"
                      type="text"
                      className="form-control"
                      placeholder="Entry For"
                      aria-label="Entry For"
                      value={el.entryFor}
                      name="entry_for"
                      onChange={event => this.handleChange(event, i)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      id="inpuptPhase"
                      type="text"
                      className="form-control"
                      placeholder="Phase"
                      aria-label="Phase"
                      value={el.phase}
                      name="phase"
                      onChange={event => this.handleChange(event, i)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <textarea
                      id="inpuptDescription"
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      aria-label="Description"
                      value={el.description}
                      name="details"
                      rows="4"
                      onChange={event => this.handleChange(event, i)}
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="form-check mt-3">
                <button
                  type="submit"
                  value="Submit"
                  className="btn btn-login alignright"
                >
                  Create
                </button>
                <button
                  onClick={event => {
                    this.addNewDrug(event);
                  }}
                  type="button"
                  className="btn btn-login alignleft"
                >
                  Add Another
                </button>
              </div>
            </form>
          </div>
        </center>
      </React.Fragment>
    );
  }
}

export default AddDrug;
