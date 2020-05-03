import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import "../styles/Search.css";
import axios from "axios";
import NavBar from "./NavBar";
import "../styles/TGADetails.css";
import AusMap from "./AusMap";
import PBSDetails from "./PBSDetails";
import { max } from "d3";
import ReactLoading from "react-loading";
import $ from "jquery";
import ReactGA from "react-ga";

class MalacardsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      malacards: {},
      pbsData: [],
      userLoggedIn: false
    };
  }

  changeUrl = url => {
    var changedUrl = url.replace(/&amp;/g, "&");
    return changedUrl;
  };

  componentDidMount() {
    document.title = "Malacards Details";
    var self = this;

    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    $(".navbar-dark").addClass("shadow-header");
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
            $(".navbar-dark").addClass("shadow-header");
          }
        });
      }
    });

    if (localStorage.getItem("access-token")) {
      this.setState({
        userLoggedIn: true
      });
    } else {
      this.setState({
        userLoggedIn: false
      });
    }

    var url = "https://api-archimedes.herokuapp.com/malacards/details";
    var payload = {
      token: localStorage.getItem("access-token"),
      id: this.props.match.params.id
    };
    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            self.setState({ malacards: response.data.data });
            console.log(response.data.data);
            console.log(response.data.pbsData);
            var dict = {};
            if (response.data.pbsData) {
              self.setState({ pbsData: response.data.pbsData });

              for (var item in response.data.pbsData) {
                var pbs = response.data.pbsData[item];

                if (pbs && pbs != null) {
                  for (var stateValue in pbs.medicarePBS) {
                    var value = !isNaN(pbs.medicarePBS[stateValue])
                      ? 0
                      : parseInt(pbs.medicarePBS[stateValue].replace(/,/g, ""));

                    if (dict[stateValue]) {
                      var amount = dict[stateValue] + value;
                      dict[stateValue] = amount;
                    } else {
                      dict[stateValue] = value;
                    }
                  }

                  for (var stateValue in pbs.medicareRPBS) {
                    var value = !isNaN(pbs.medicareRPBS[stateValue])
                      ? 0
                      : parseInt(
                          pbs.medicareRPBS[stateValue].replace(/,/g, "")
                        );

                    if (dict[stateValue]) {
                      var amount = dict[stateValue] + value;
                      dict[stateValue] = amount;
                    } else {
                      dict[stateValue] = value;
                    }
                  }
                }
              }
            }
          }
        }
      })
      .catch(function(error) {});
  }

  render() {
    if (!this.state.malacards.details) {
      return (
        <React.Fragment>
          <NavBar logout={this.logout} userLoggedIn={this.state.userLoggedIn} />
          <div className="loading-details">
            <ReactLoading
              type={"spin"}
              key={0}
              className="loading-image"
              color="#13aa52"
              id="loading"
            />
          </div>
        </React.Fragment>
      );
    } else {
      let trs = (
        <React.Fragment>
          {this.state.malacards.details.map((detail, i) => (
            <div key={i}>
              <h5>{detail.title}</h5>
              <ul>
                {detail.values.map((li, index) => (
                  <li key={index}>{li}</li>
                ))}
              </ul>
            </div>
          ))}
        </React.Fragment>
      );

      return (
        <React.Fragment>
          <NavBar logout={this.logout} userLoggedIn={this.state.userLoggedIn} />
          <div className="bg-white mt-48">
            <div className="container margin-50">
              <h2 className="text-dark text-capitalize">
                {this.state.malacards.name}
              </h2>
              <span className="badge text-primary text-capitalize font-16">
                <ins>{this.state.malacards.category}</ins>
              </span>
              <span className="badge badge-danger font-16">
                {this.state.malacards.mcid}
              </span>
              <span
                className={
                  "badge badge-primary font-16 ml-2 " +
                  (this.state.malacards.family === "N/A" ? "d-none" : "")
                }
              >
                {this.state.malacards.family}
              </span>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-sm-6 mt-4">{trs}</div>

              <div className="col-sm-6">
                <PBSDetails pbsData={this.state.pbsData} />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default MalacardsDetails;
