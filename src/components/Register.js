import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiEmail,
  mdiKey,
  mdiAccount,
  mdiOfficeBuilding,
  mdiMapMarker
} from "@mdi/js";
import "bootstrap/dist/js/bootstrap.min";
import "popper.js";
import axios from "axios";
import $ from "jquery";
import "../styles/Register.css";
import ReactGA from "react-ga";

class Register extends Component {
  componentDidMount() {
    document.title = "Register";
    document.body.classList.add("center-register");

    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentWillUnmount() {
    document.body.classList.remove("center-register");
  }

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      address: "",
      companyName: ""
    };
  }

  handleSubmit = event => {
    ReactGA.event({
      category: "User",
      action: "Create Account"
    });

    var self = this;
    var url = "https://api-archimedes.herokuapp.com/register";
    var payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      address: this.state.address,
      company_name: this.state.companyName
    };
    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            self.props.history.push("/login");
          } else {
            $("#alert-content").text(response.data.message);
            $("#alert-content").css("visibility", "show");
          }
        }
      })
      .catch(function(error) {
        $("#alert-content").text(
          "Something went wrong please try after some time."
        );
        $("#alert-content").css("visibility", "show");
      });
    event.preventDefault();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    return (
      <section className="register-block">
        <div className="container register shadow">
          <div className="row">
            <div className="col-md-12 col-lg-4 register-sec p-5">
              <h2 className="text-center">Register</h2>
              <form
                className="register-form needs-validation"
                onSubmit={this.handleSubmit}
              >
                <div className="form-group">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <Icon
                          path={mdiAccount}
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                        />
                      </span>
                    </div>
                    <input
                      id="name-input"
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      aria-label="Name"
                      value={this.state.name}
                      name="name"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <Icon
                          path={mdiEmail}
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                        />
                      </span>
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      aria-label="Email"
                      value={this.state.email}
                      name="email"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <Icon
                          path={mdiKey}
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                        />
                      </span>
                    </div>
                    <input
                      id="password-input"
                      type="password"
                      minLength="8"
                      className="form-control"
                      placeholder="Password"
                      aria-label="Password"
                      value={this.state.password}
                      name="password"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <Icon
                          path={mdiOfficeBuilding}
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                        />
                      </span>
                    </div>
                    <input
                      id="commpany-name-input"
                      type="text"
                      className="form-control"
                      placeholder="Company"
                      aria-label="Company"
                      value={this.state.companyName}
                      name="companyName"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <Icon
                          path={mdiMapMarker}
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                        />
                      </span>
                    </div>
                    <input
                      id="address-input"
                      type="text"
                      className="form-control"
                      placeholder="Address"
                      aria-label="Address"
                      value={this.state.address}
                      name="address"
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>
                <p id="alert-content" className="text-danger" />
                <div className="form-check mt-3">
                  <button
                    type="submit"
                    value="Submit"
                    className="btn btn-register float-right"
                  >
                    Submit
                  </button>
                </div>
              </form>
              <div className="copy-text">Copyright © 2018, Archimedes.</div>
            </div>
            <div className="col-md-12 col-lg-8 banner-sec">
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-ride="carousel"
              >
                <ol className="carousel-indicators">
                  <li
                    data-target="#carouselExampleIndicators"
                    data-slide-to="0"
                    className="active"
                  />
                  <li
                    data-target="#carouselExampleIndicators"
                    data-slide-to="1"
                  />
                  <li
                    data-target="#carouselExampleIndicators"
                    data-slide-to="2"
                  />
                </ol>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      className="d-block w-100"
                      src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg"
                      alt="First slide"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h2 className="text-left">Register</h2>
                      <p className="text-left">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.{" "}
                      </p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg"
                      alt="Second slide"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h2 className="text-left">Register</h2>
                      <p className="text-left">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.{" "}
                      </p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img
                      className="d-block w-100"
                      src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg"
                      alt="Third slide"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      <h2 className="text-left">Register</h2>
                      <p className="text-left">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Register;
