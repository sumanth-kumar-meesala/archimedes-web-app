import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import NavBar from "./NavBar";
import { mdiMagnify, mdiStar, mdiStarOutline } from "@mdi/js";
import Icon from "@mdi/react";
import "../styles/Search.css";
import axios from "axios";
import ReactLoading from "react-loading";
import InfiniteScroll from "react-infinite-scroller";
import $ from "jquery";
import ReactGA from "react-ga";

class MalacardsSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      userLoggedIn: false,
      count: 20,
      malacards: [],
      hasMore: false,
      noResults: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem("userId")) {
    } else {
      ReactGA.initialize("UA-133763028-1");
    }

    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    var self = this;
    document.title = "Malacards Search";

    this.search();

    $("#input-search").keypress(function(event) {
      var keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode === 13) {
        self.setState({ count: 0 });
        self.search();
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
      action: "Malacards Search",
      label: this.state.keyword
    });

    let self = this;

    self.setState({
      hasMore: true,
      malacards: [],
      noResults: false
    });

    var url = "https://api-archimedes.herokuapp.com/malacards/search";
    var payload = {
      keyword: this.state.keyword,
      token: localStorage.getItem("access-token"),
      count: 0
    };
    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            if (response.data.data.length === 0) {
              self.setState({ hasMore: false, noResults: true });
            }

            self.setState({
              malacards: response.data.data,
              count: response.data.data.length
            });
          } else {
          }
        }
      })
      .catch(function(error) {});
  };

  loadMore = event => {
    let self = this;
    if (self.state.count !== 0) {
      var url = "https://api-archimedes.herokuapp.com/malacards/search";
      var payload = {
        keyword: this.state.keyword,
        token: localStorage.getItem("access-token"),
        count: this.state.count
      };
      axios
        .post(url, payload)
        .then(function(response) {
          if (response.data !== undefined) {
            if (response.data.success) {
              if (response.data.data.length === 0) {
                self.setState({ hasMore: false });
              }

              var newMalacards = self.state.malacards.concat(
                response.data.data
              );

              self.setState({
                malacards: newMalacards,
                count: newMalacards.length
              });
            } else {
            }
          }
        })
        .catch(function(error) {});
    }
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

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    let data = (
      <div className="container container-search">
        {this.state.malacards.map((malacard, i) => (
          <div
            className="card mt-1 mb-1 shadow hover"
            key={i}
            onClick={event => {
              this.viewDetails(event, malacard._id);
            }}
          >
            <div className="card-body">
              <h5 className="card-title text-dark">{malacard.name}</h5>
              <span className="badge badge-primary ml-2">{malacard.mcid}</span>
              <span className="badge badge-info ml-2">{malacard.category}</span>
              <span className="badge badge-danger ml-2">{malacard.mifts}</span>
              <span
                className={
                  "badge badge-success ml-2 " +
                  (malacard.family === "N/A" ? "d-none" : "")
                }
              >
                {malacard.family}
              </span>

              <Icon
                path={malacard.is_bookmarked ? mdiStar : mdiStarOutline}
                size={1}
                style={{ float: "right" }}
                horizontal
                vertical
                color="#9e9e9e"
                onClick={event => {
                  this.bookmark(event, malacard._id, malacard.is_bookmarked, i);
                }}
                rotate={180}
              />
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <React.Fragment>
        <NavBar logout={this.logout} userLoggedIn={this.state.userLoggedIn} />
        <div className="search-mist">
          <div className="container custom-container container-search">
            <div className="input-group shadow">
              <input
                id="input-search"
                type="text"
                className="form-control input-form"
                placeholder="Enter keyword..."
                aria-label="Enter keyword..."
                value={this.state.keyword}
                onChange={this.handleChange}
                name="keyword"
                required
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary pl-4 pr-4 elevation"
                  type="button"
                  onClick={this.search}
                >
                  <Icon
                    path={mdiMagnify}
                    size={1}
                    horizontal
                    vertical
                    color="#fff"
                    rotate={180}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {!this.state.noResults ? (
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={
              <ReactLoading
                type={"spin"}
                key={0}
                className="loading-image mt-1"
                color="#13aa52"
              />
            }
          >
            {data}
          </InfiniteScroll>
        ) : (
          <div
            id="search-empty"
            className={"text-center" + (this.state.loadMore ? "d-none" : "")}
          >
            <Icon
              path={mdiMagnify}
              size={6}
              horizontal
              vertical
              color="#8e8e8e"
              rotate={180}
            />
            <h4 className="text-grey">Refine your search</h4>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default MalacardsSearch;
