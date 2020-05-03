import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import NavBar from "./NavBar";
import { mdiMagnify, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import "../styles/Search.css";
import axios from "axios";
import ReactLoading from "react-loading";
import InfiniteScroll from "react-infinite-scroller";
import $ from "jquery";
import ReactGA from "react-ga";

class UserSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      userLoggedIn: false,
      count: 20,
      users: [],
      hasMore: false,
      noResults: false
    };
  }

  componentDidMount() {
    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    var self = this;
    document.title = "User Search";
    document.body.classList.add("profile");
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

  componentWillUnmount() {
    document.body.classList.remove("profile");
  }

  logout = event => {
    ReactGA.event({
      category: "User",
      action: "Logout",
      label: localStorage.get("name")
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
      action: "User Search",
      label: this.state.keyword
    });

    let self = this;

    self.setState({
      hasMore: true,
      users: [],
      noResults: false
    });

    var url = "https://api-archimedes.herokuapp.com/user/search";
    var payload = {
      keyword: this.state.keyword,
      token: localStorage.getItem("access-token"),
      count: 0
    };
    axios
      .post(url, payload)
      .then(function(response) {
        console.log(response.data);
        if (response.data !== undefined) {
          if (response.data.success) {
            if (response.data.data.length === 0) {
              self.setState({ hasMore: false, noResults: true });
            }

            self.setState({
              users: response.data.data,
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
      var url = "https://api-archimedes.herokuapp.com/user/search";
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

              var newUsers = self.state.users.concat(response.data.data);

              self.setState({
                users: newUsers,
                count: newUsers.length
              });
            } else {
            }
          }
        })
        .catch(function(error) {});
    }
  };

  addToChat = user => {
    var self = this;
    var url = "https://api-archimedes.herokuapp.com/chat/add-user";
    var payload = {
      user_id: user._id,
      token: localStorage.getItem("access-token")
    };

    axios
      .post(url, payload)
      .then(function(response) {
        console.log(response.data);
        if (response.data.success) {
          self.props.history.push("/chat");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    let data = (
      <div className="container container-search mt-4">
        <div className="row">
          {this.state.users.map((user, i) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 text-center"
              key={i}
            >
              <div className="card shadow-sm pl-2 pr-2">
                <img
                  src={require("../img/account.png")}
                  alt={user.name}
                  className="card-img-top image-90 rounded-circle"
                />
                <div className="card-body remove-padding">
                  <h6 className="mid-night mt-4 mid-night text-truncate">
                    {user.name}
                  </h6>
                  <p className="color-grey text-truncate">
                    {user.company_name}
                  </p>
                  <button
                    className="btn btn-invite"
                    onClick={event => {
                      this.addToChat(user);
                    }}
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default UserSearch;
