import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import NavBar from "./NavBar";
import "../styles/Profile.css";
import axios from "axios";
import { mdiStar, mdiStarOutline, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import ReactGA from "react-ga";
import ReactLoading from "react-loading";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      tgas: [],
      malacards: [],
      my_tgas: [],
      userLoggedIn: false
    };
  }

  componentDidMount() {
    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    var self = this;
    document.title = "Profile";
    document.body.classList.add("profile");

    if (localStorage.getItem("access-token")) {
      this.setState({
        userLoggedIn: true
      });
    } else {
      this.setState({
        userLoggedIn: false
      });
    }

    var url = "https://api-archimedes.herokuapp.com/profile";

    var bodyParameters = {
      token: localStorage.getItem("access-token")
    };

    axios
      .post(url, bodyParameters)
      .then(function(response) {
        console.log(response.data);
        var tgas = response.data.tgas;
        var malacards = response.data.malacards;
        var my_tgas = response.data.my_tgas;

        if (!tgas) {
          tgas = [];
        }

        if (!malacards) {
          malacards = [];
        }

        if (!my_tgas) {
          my_tgas = [];
        }

        self.setState({
          user: response.data.data,
          tgas: tgas,
          malacards: malacards,
          my_tgas: my_tgas
        });
      })
      .catch(function(error) {});
  }

  componentWillUnmount() {
    document.body.classList.remove("profile");
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

  search = event => {
    ReactGA.event({
      category: "Search",
      action: "Profile Search",
      label: this.state.keyword
    });

    console.log(this.state.keyword);
    var url = "https://api-archimedes.herokuapp.com/tga/search";
    var payload = {
      keyword: this.state.keyword
    };
    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            console.log(response.data);
          } else {
          }
        }
      })
      .catch(function(error) {});
    event.preventDefault();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  bookmark_tga = (event, tga_id, is_bookmarked, index) => {
    var self = this;
    var newTgas = self.state.tgas;
    newTgas[index].is_bookmarked = !is_bookmarked;

    self.setState({ tgas: newTgas });
    var url = "https://api-archimedes.herokuapp.com/tga/bookmark";

    if (is_bookmarked) {
      url = "https://api-archimedes.herokuapp.com/tga/remove-bookmark";
    }

    var bodyParameters = {
      token: localStorage.getItem("access-token"),
      tga_id: tga_id
    };

    axios
      .post(url, bodyParameters)
      .then(function(response) {
        console.log(response.data);
        if (response.data.success) {
        }
      })
      .catch(function(error) {});

    event.stopPropagation();
  };

  viewDetails_tga = (event, tga_id) => {
    window.open("/tga/" + tga_id, "_blank");
  };

  viewDetails = (event, malacards_id) => {
    window.open("/malacards/" + malacards_id, "_blank");
  };

  bookmark = (event, malacards_id, is_bookmarked, index) => {
    var self = this;
    var newMalacards = self.state.malacards;
    newMalacards[index].is_bookmarked = !is_bookmarked;

    self.setState({ malacards: newMalacards });
    var url = "https://api-archimedes.herokuapp.com/malacards/bookmark";

    if (is_bookmarked) {
      url = "https://api-archimedes.herokuapp.com/malacards/remove-bookmark";
    }

    var bodyParameters = {
      token: localStorage.getItem("access-token"),
      malacards_id: malacards_id
    };

    axios
      .post(url, bodyParameters)
      .then(function(response) {
        console.log(response.data);
        if (response.data.success) {
        }
      })
      .catch(function(error) {});
    event.stopPropagation();
  };

  render() {
    if (!this.state.user.name) {
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
      return (
        <React.Fragment>
          <NavBar logout={this.logout} userLoggedIn={this.state.userLoggedIn} />
          <div className="profile-mist">
            <center>
              <div className="bio">
                <img
                  src={require("../img/account.png")}
                  alt={this.state.user.name}
                  className="rounded-circle profile img-size float-left"
                />
                <div className="profile-margin">
                  <h3 className="text-left">{this.state.user.name}</h3>
                  <h5 className="text-left text-dark">
                    {this.state.user.company_name}
                  </h5>
                  <h5 className="text-left text-dark">
                    {this.state.user.address}
                  </h5>
                </div>
              </div>
            </center>
          </div>

          <center>
            <div className="user-profile">
              <ul
                className="nav nav-tabs nav-fill justify-content-center"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="malacards-tab"
                    data-toggle="tab"
                    href="#malacards"
                    role="tab"
                    aria-controls="malacards"
                    aria-selected="true"
                  >
                    Malacards
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="tga-tab"
                    data-toggle="tab"
                    href="#tga"
                    role="tab"
                    aria-controls="tga"
                    aria-selected="false"
                  >
                    TGA
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="my-tga-tab"
                    data-toggle="tab"
                    href="#my-tga"
                    role="tab"
                    aria-controls="my-tga"
                    aria-selected="false"
                  >
                    Your drugs
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="malacards"
                  role="tabpanel"
                  aria-labelledby="malacards-tab"
                >
                  {this.state.malacards.length === 0 ? (
                    <p className="color-grey p-4">No bookmarks</p>
                  ) : (
                    this.state.malacards.map((malacard, i) => (
                      <div
                        className="card mt-1 mb-1 shadow text-left"
                        key={i}
                        onClick={event => {
                          this.viewDetails(event, malacard._id);
                        }}
                      >
                        <div className="card-body">
                          <h5 className="card-title text-dark">
                            {malacard.name}
                          </h5>
                          <span className="badge badge-primary ml-2">
                            {malacard.mcid}
                          </span>
                          <span className="badge badge-info ml-2">
                            {malacard.category}
                          </span>
                          <span className="badge badge-danger ml-2">
                            {malacard.mifts}
                          </span>
                          <span
                            className={
                              "badge badge-success ml-2 " +
                              (malacard.family === "N/A" ? "d-none" : "")
                            }
                          >
                            {malacard.family}
                          </span>

                          <Icon
                            path={
                              malacard.is_bookmarked ? mdiStar : mdiStarOutline
                            }
                            size={1}
                            style={{ float: "right" }}
                            horizontal
                            vertical
                            color="#9e9e9e"
                            onClick={event => {
                              this.bookmark_malacards(
                                event,
                                malacard._id,
                                malacard.is_bookmarked,
                                i
                              );
                            }}
                            rotate={180}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="tga"
                  role="tabpanel"
                  aria-labelledby="tga-tab"
                >
                  {this.state.tgas.length === 0 ? (
                    <p className="color-grey p-4">No bookmarks</p>
                  ) : (
                    this.state.tgas.map((tga, i) => (
                      <div
                        className="card mt-1 mb-1 shadow text-left"
                        value={tga}
                        onClick={event => {
                          this.viewDetails_tga(event, tga._id);
                        }}
                        key={i}
                      >
                        <div className="card-body">
                          <h5 className="card-title text-dark">
                            {tga.product_name}
                          </h5>
                          <span
                            className={
                              "badge badge-primary ml-2  d-inline-block text-truncate  " +
                              (tga.sponser_name === "N/A" ? "d-none" : "")
                            }
                            style={{ maxWidth: 300 }}
                          >
                            {tga.sponser_name}
                          </span>
                          <span
                            className={
                              "badge badge-danger ml-2 text-truncate " +
                              (tga.active_ingredients === "N/A" ? "d-none" : "")
                            }
                            style={{ maxWidth: 300 }}
                          >
                            {tga.active_ingredients}
                          </span>

                          <span
                            className={
                              "badge badge-success ml-2 d-inline-block text-truncate  " +
                              (tga.entry_for === "N/A" ? "d-none" : "")
                            }
                            style={{ maxWidth: 300 }}
                          >
                            {tga.entry_for}
                          </span>
                          <Icon
                            path={tga.is_bookmarked ? mdiStar : mdiStarOutline}
                            size={1}
                            style={{ float: "right" }}
                            horizontal
                            vertical
                            color="#9e9e9e"
                            onClick={event => {
                              this.bookmark_tga(
                                event,
                                tga._id,
                                tga.is_bookmarked,
                                i
                              );
                            }}
                            rotate={180}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="my-tga"
                  role="tabpanel"
                  aria-labelledby="my-tga-tab"
                >
                  {this.state.my_tgas.length === 0 ? (
                    <p className="color-grey p-4">You don't have any drugs</p>
                  ) : (
                    this.state.my_tgas.map((tga, i) => (
                      <div
                        className="card mt-1 mb-1 shadow text-left"
                        value={tga}
                        onClick={event => {
                          this.viewDetails_tga(event, tga._id);
                        }}
                        key={i}
                      >
                        <div className="card-body">
                          <h5 className="card-title text-dark">
                            {tga.product_name}
                          </h5>
                          <span
                            className={
                              "badge badge-primary ml-2  d-inline-block text-truncate  " +
                              (tga.sponser_name === "N/A" ? "d-none" : "")
                            }
                            style={{ maxWidth: 300 }}
                          >
                            {tga.sponser_name}
                          </span>
                          <span
                            className={
                              "badge badge-danger ml-2 text-truncate " +
                              (tga.active_ingredients === "N/A" ? "d-none" : "")
                            }
                            style={{ maxWidth: 300 }}
                          >
                            {tga.active_ingredients}
                          </span>

                          <span
                            className={
                              "badge badge-success ml-2 d-inline-block text-truncate  " +
                              (tga.entry_for === "N/A" ? "d-none" : "")
                            }
                            style={{ maxWidth: 300 }}
                          >
                            {tga.entry_for}
                          </span>
                          <Icon
                            path={tga.is_bookmarked ? mdiStar : mdiStarOutline}
                            size={1}
                            style={{ float: "right" }}
                            horizontal
                            vertical
                            color="#9e9e9e"
                            onClick={event => {
                              this.bookmark_tga(
                                event,
                                tga._id,
                                tga.is_bookmarked,
                                i
                              );
                            }}
                            rotate={180}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </center>
        </React.Fragment>
      );
    }
  }
}

export default Profile;
