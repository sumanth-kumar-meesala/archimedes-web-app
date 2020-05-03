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

class TGADetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tga: {},
      mapData: [],
      pbsData: [],
      userLoggedIn: false
    };
  }

  changeUrl = url => {
    if (url) {
      var changedUrl = url.replace(/&amp;/g, "&");
      return changedUrl;
    }
    return "";
  };

  componentDidMount() {
    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    document.title = "TGA Details";
    var self = this;

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

    var url = "https://api-archimedes.herokuapp.com/tga/details";
    var payload = {
      token: localStorage.getItem("access-token"),
      id: this.props.match.params.id
    };
    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            self.setState({ tga: response.data.data });

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

              var mapValues = [];
              var array = [];

              for (var key in dict) {
                var value = dict[key];
                mapValues[key] = value;
                array.push(value);
              }

              var maxValue = max(array);
              var percentages = {};

              for (var state in mapValues) {
                var percentage = (
                  (mapValues[state] / maxValue) *
                  100
                ).toFixed();
                percentages[state] = percentage;
              }

              self.setState({ mapData: dict, percentages: percentages });
            }
          }
        }
      })
      .catch(function(error) {});
  }

  render() {
    if (!this.state.tga.details) {
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
          {this.state.tga.details.map((detail, i) => (
            <tr key={i}>
              <th scope="row">{detail.title}</th>
              <td>:</td>
              <td>
                {detail.url ? (
                  <a href={this.changeUrl(detail.url)} target="_blank">
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </td>
            </tr>
          ))}
        </React.Fragment>
      );

      return (
        <React.Fragment>
          <NavBar logout={this.logout} userLoggedIn={this.state.userLoggedIn} />
          <div className="bg-white mt-48">
            <div className="container margin-50">
              <h2 className="text-dark text-capitalize">
                {this.state.tga.product_name}
              </h2>
              <span className="badge text-primary text-capitalize font-16">
                <ins>{this.state.tga.active_ingredients}</ins>
              </span>
              <span className="badge badge-danger font-16">Commercialised</span>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <table className="table table-borderless mt-4">
                  <tbody>
                    <tr />
                    <tr>
                      <th scope="row">Sponser Name</th>
                      <td>:</td>
                      <td className="text-capitalize">
                        {this.state.tga.sponser_name}
                      </td>
                    </tr>
                    {this.state.tga.details.length > 0 ? trs : <div />}
                  </tbody>
                </table>
                <PBSDetails pbsData={this.state.pbsData} />
              </div>

              <div className="col-sm-6">
                <AusMap
                  mapData={this.state.mapData}
                  percentages={this.state.percentages}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default TGADetails;
