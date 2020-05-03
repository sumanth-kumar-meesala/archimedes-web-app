import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import "popper.js";
import "../styles/NavBar.css";
import "../styles/stylish-portfolio.min.css";
import $ from "jquery";
import Payment from "./Payment";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: localStorage.getItem("name"),
      isPremium: ""
    };
  }

  componentDidMount() {
    var that = this;

    var isPremium = localStorage.getItem("isPremium");
    if (isPremium === "true") {
      this.setState({ isPremium: "d-none" });
    } else {
      this.setState({ isPremium: "" });
    }

    $(".menu-toggle").click(function(e) {
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("active");

      $(that).toggleClass("active");
    });

    if (that.props.blackBG) {
      $(".navbar-dark").addClass("shadow-header");
    } else {
      $(document).ready(function() {
        var scroll_start = 0;
        var startchange = $("#nav-scroll");
        var offset = startchange.offset();
        if (startchange.length) {
          $(document).scroll(function() {
            scroll_start = $(this).scrollTop();
            if (scroll_start > offset.top) {
              $(".navbar-dark").addClass("shadow-header");
            } else {
              $(".navbar-dark").removeClass("shadow-header");
            }
          });
        }
      });
    }
  }

  paymentSuccess = isPremium => {
    if (isPremium) {
      this.setState({ isPremium: "d-none" });
    } else {
      this.setState({ isPremium: "" });
    }
  };

  render() {
    return (
      <React.Fragment>
        <nav
          className="navbar navbar-expand-md navbar-dark fixed-top bg-lg"
          id="nav-scroll"
        >
          <a className="navbar-brand" href="/">
            Archimedes
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="/tga-search">
                  TGA
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/malacards-search">
                  Malacards
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/user-search">
                  User
                </a>
              </li>
            </ul>
            <div className="navbar-collapse collapse order-3 dual-collapse2">
              <ul className="navbar-nav ml-auto">
                <li
                  className={
                    "nav-item " + (this.props.userLoggedIn ? "d-none" : "")
                  }
                >
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </li>
                <li
                  className={
                    "nav-item " + (this.props.userLoggedIn ? "d-none" : "")
                  }
                >
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
                <li
                  className={
                    "nav-item dropdown " +
                    (this.props.userLoggedIn ? "" : "d-none")
                  }
                >
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {this.state.name}
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <a className="dropdown-item" href="/profile">
                      Profile
                    </a>
                    <a className="dropdown-item" href="/chat">
                      Messages
                    </a>
                    <a className="dropdown-item" href="/add-drug">
                      Add Drug
                    </a>
                    <a className={"dropdown-item " + this.state.isPremium}>
                      <Payment
                        getPaymentStatus={this.paymentSuccess.bind(this)}
                      />
                    </a>
                    <a className="dropdown-item" onClick={this.props.logout}>
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default NavBar;
