import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import NavBar from "./NavBar";
import "../styles/Chat.css";
import axios from "axios";
import ReactLoading from "react-loading";
import io from "socket.io-client";
import $ from "jquery";
import ReactGA from "react-ga";

const socket = io("http://localhost:8000");

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      chats: [],
      user: {},
      messages: [],
      userLoggedIn: false,
      message: "",
      loading: false
    };
  }

  componentDidMount() {
    var self = this;
    document.title = "Chat";
    document.body.classList.add("profile");

    socket.on("connect", function() {});
    socket.on("disconnect", function() {});

    ReactGA.initialize("UA-133763028-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    if (localStorage.getItem("access-token")) {
      this.setState({
        userLoggedIn: true
      });
    } else {
      this.setState({
        userLoggedIn: false
      });
    }

    var url = "https://api-archimedes.herokuapp.com/user/list-user";
    var payload = {
      token: localStorage.getItem("access-token")
    };

    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data.success) {
          self.setState({
            users: response.data.data,
            chats: response.data.chat_ids
          });

          if (self.state.users.length > 0) {
            self.showChat(self.state.users[0]);
          }

          response.data.chat_ids.map(chat_id => {
            socket.on(chat_id, function(data) {
              if (chat_id === self.state.user.chat_id) {
                var message = { user_id: data.user_id, message: data.message };
                var msgs = self.state.messages;
                msgs.push(message);
                self.setState({ messages: msgs });
                $(".messages")
                  .stop()
                  .animate({ scrollTop: $(".messages")[0].scrollHeight }, 1000);
              }
            });
          });
        }
      })
      .catch(function(error) {});

    $("#message-input").keypress(function(event) {
      var keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode === 13) {
        self.sendMessage(self.state.user);
      }
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentWillUnmount() {
    document.body.classList.remove("profile");
    socket.disconnect();
  }

  sendMessage = user => {
    ReactGA.event({
      category: "User",
      action: "Send Message",
      label: localStorage.getItem("name")
    });

    var self = this;
    if (this.state.message.trim() !== "") {
      var self = this;
      var url = "https://api-archimedes.herokuapp.com/chat/add-chat";
      var payload = {
        token: localStorage.getItem("access-token"),
        message: this.state.message,
        chat_id: user.chat_id,
        user_id: user._id,
        is_file: false
      };
      var sentTo = {
        user_id: user._id,
        message: self.state.message,
        chat_id: user.chat_id
      };

      socket.emit("send", sentTo);
      self.setState({ message: "" });

      axios
        .post(url, payload)
        .then(function(response) {
          if (response.data.success) {
          }
        })
        .catch(function(error) {});
    }
  };

  showChat = user => {
    this.setState({ user: user, loading: true });
    let self = this;
    var url = "https://api-archimedes.herokuapp.com/chat/get-chat";
    var payload = {
      chat_id: user.chat_id,
      token: localStorage.getItem("access-token")
    };
    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            self.setState({
              messages: response.data.data.message,
              loading: false
            });
          } else {
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

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
    let data = this.state.loading ? (
      <div className="loading">
        <ReactLoading type={"spin"} key={0} color="#13aa52" />
      </div>
    ) : (
      <React.Fragment>
        <div className="messages">
          {this.state.messages.map((message, index) => (
            <div
              className={
                "msg-list " +
                (message.user_id === this.state.user._id ? "" : "sender")
              }
              key={index}
            >
              <div className="messenger-container">
                <p>{message.message}</p>
              </div>
              <div className="clear" />
            </div>
          ))}
        </div>
      </React.Fragment>
    );

    function GetChat({ user }) {
      if (user !== undefined) {
        return (
          <div className="inline-flex-parent pl-2">
            <img
              src={require("../img/account.png")}
              alt="Profile"
              className="rounded-circle user_img"
            />
            <div className="user-details">
              <span className="mid-night font-600">{user.name}</span>
              <p className="gery-50 text-left">{user.company_name}</p>
            </div>
          </div>
        );
      } else {
        return (
          <img
            src={require("../img/account.png")}
            alt="Profile"
            className="rounded-circle user_img"
          />
        );
      }
    }

    if (this.state.users) {
      if (this.state.users.length > 0) {
        return (
          <React.Fragment>
            <NavBar
              logout={this.logout}
              userLoggedIn={this.state.userLoggedIn}
            />
            <div className="chat-mist" />
            <center>
              <div className="user-profile-chat row">
                <div className="col-5 chat-profile">
                  <ul className="list-group list-group-flush">
                    {this.state.users.map((user, index) => (
                      <li
                        className="list-group-item text-left chat pl-2"
                        key={index}
                        onClick={event => this.showChat(user)}
                      >
                        <div className="inline-flex-parent">
                          <img
                            src={require("../img/account.png")}
                            alt="Profile"
                            className="rounded-circle user_img"
                          />
                          <div className="user-details">
                            <span
                              className="mid-night font-600 d-inline-block text-truncate"
                              style={{ maxWidth: "150px" }}
                            >
                              {user.name}
                            </span>
                            <p className="gery-50">{user.company_name}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-7 bg-white container">
                  <div className="top bg-light text-left pt-2">
                    {this.state.users.length > 0 ? (
                      <GetChat user={this.state.user} />
                    ) : (
                      <div />
                    )}
                  </div>
                  <div>{data}</div>
                  <div className="bottom text-left">
                    <div className="input-group mb-3">
                      <input
                        id="message-input"
                        type="text"
                        className="form-control"
                        placeholder="Message"
                        aria-label="Message"
                        aria-describedby="Message"
                        name="message"
                        value={this.state.message}
                        onChange={this.handleChange}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={event => this.sendMessage(this.state.user)}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </center>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <NavBar
              logout={this.logout}
              userLoggedIn={this.state.userLoggedIn}
              blackBG={true}
            />

            <h1 className="text-grey center">No chat available</h1>
          </React.Fragment>
        );
      }
    } else {
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
              blackBG={true}
            />
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Chat;
