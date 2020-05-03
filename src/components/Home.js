import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import "popper.js";
import NavBar from "./NavBar";
import "../styles/Home.css";
import { mdiPill, mdiMessage, mdiNote } from "@mdi/js";
import Icon from "@mdi/react";
import Footer from "./Footer";
import ReactGA from "react-ga";
var lab_1a = require("../img/lab_1a.jpg");
var lab_1b = require("../img/lab_1b.jpg");
var lab_1c = require("../img/lab_1c.jpg");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false
    };
  }

  componentDidMount() {
    document.title = "Home";

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

  logout = event => {
    ReactGA.event({
      category: "User",
      action: "Logout",
      label: localStorage.getItem("name")
    });

    localStorage.removeItem("isPremium");
    localStorage.removeItem("access-token");
    this.setState({
      userLoggedIn: false
    });

    this.props.history.push("/");
  };

  render() {
    function initializeReactGA() {
      ReactGA.initialize("UA-133763028-1");
      ReactGA.pageview("/homepage");
    }

    return (
      <div>
        <NavBar logout={this.logout} userLoggedIn={this.state.userLoggedIn} />
        <header className="masthead d-flex">
          <div className="container text-center my-auto">
            <h1 className="mb-1"> Archimedes </h1>
            <h3 className="mb-5">
              <em> Lorem Ipsum is simply dummy text. </em>
            </h3>
            <a
              className="btn btn-primary btn-xl js-scroll-trigger"
              href="#about"
            >
              Find Out More
            </a>
          </div>
          <div className="overlay" />
        </header>
        <section className="content-section bg-white" id="about">
          <div className="container text-center">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <h2 className="text-body text-dark">
                  Lorem Ipsum is simply dummy text of the printing
                </h2>
                <p className="lead mb-5 text-secondary">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <a
                  className="btn btn-dark btn-xl js-scroll-trigger"
                  href="#services"
                >
                  What We Offer
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          className="content-section  bg-primary text-white text-center"
          id="services"
        >
          <div className="container">
            <div className="content-section-heading">
              <h2 className="text-white mb-0"> Services </h2>
              <h3 className="text-light mb-5"> What We Offer </h3>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
                <span className="service-icon rounded-circle mx-auto mb-3">
                  <Icon
                    path={mdiPill}
                    size={2}
                    horizontal
                    vertical
                    color="#13aa52"
                    rotate={180}
                  />
                </span>
                <h4 className="text-white">
                  <strong> Drugs </strong>
                </h4>
                <p className="text-faded mb-0 text-light">
                  Lorem Ipsum is simply dummy text
                </p>
              </div>
              <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
                <span className="service-icon rounded-circle mx-auto mb-3">
                  <Icon
                    path={mdiMessage}
                    size={2}
                    horizontal
                    vertical
                    color="#13aa52"
                    rotate={180}
                  />
                </span>
                <h4 className="text-white">
                  <strong> Chat </strong>
                </h4>
                <p className="text-faded mb-0 text-light">
                  Lorem Ipsum is simply dummy text
                </p>
              </div>
              <div className="col-lg-4 col-md-6 mb-5 mb-md-0">
                <span className="service-icon rounded-circle mx-auto mb-3">
                  <Icon
                    path={mdiNote}
                    size={2}
                    horizontal
                    vertical
                    color="#13aa52"
                    rotate={180}
                  />
                </span>
                <h4 className="text-white">
                  <strong> Patient </strong>
                </h4>
                <p className="text-faded mb-0 text-light">
                  Lorem Ipsum is simply dummy text
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="showcase">
          <div className="container-fluid margin p-0">
            <div className="row no-gutters">
              <div
                className="col-lg-6 order-lg-2 text-white showcase-img"
                style={{ backgroundImage: "url(" + lab_1c + ")" }}
              />
              <div className="col-lg-6 order-lg-1 my-auto showcase-text ">
                <h2 className="text-body"> What is Lorem Ipsum </h2>
                <p className="lead mb-0 text-secondary">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
            <div className="row no-gutters">
              <div
                className="col-lg-6 text-white showcase-img"
                style={{ backgroundImage: "url(" + lab_1a + ")" }}
              />
              <div className="col-lg-6 my-auto showcase-text">
                <h2 className="text-body"> What is Lorem Ipsum </h2>
                <p className="lead mb-0 text-secondary">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.Lorem Ipsum has been the industry 's
                  standard dummy text ever since the 1500 s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
            </div>
            <div className="row no-gutters">
              <div
                className="col-lg-6 order-lg-2 text-white showcase-img"
                style={{ backgroundImage: "url(" + lab_1b + ")" }}
              />
              <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                <h2 className="text-body"> What is Lorem Ipsum </h2>
                <p className="lead mb-0 text-secondary">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.Lorem Ipsum has been the industry 's
                  standard dummy text ever since the 1500 s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default Home;
