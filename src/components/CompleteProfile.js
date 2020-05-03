import React, { Component } from "react";
import ReactGA from "react-ga";
import NavBar from "./NavBar";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import "../styles/CompleteProfile.css";
import axios from "axios";

class CompleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      tags: [],
      tag: "",
      want_commercialise: false,
      looking_for: false
    };
  }

  componentDidMount() {
    document.title = "Complete Profile";
    document.body.classList.add("add-drug");

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
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChange = tags => {
    this.setState({ tags });
  };

  handleChangeInput = tag => {
    this.setState({ tag });
  };

  handleSubmit = event => {
    var self = this;

    ReactGA.event({
      category: "User",
      action: "Complete Profile"
    });

    var url = "https://api-archimedes.herokuapp.com/update-profile";

    var payload = {
      token: localStorage.getItem("access-token"),
      tags: self.state.tags,
      want_commercialise: self.state.want_commercialise,
      looking_for: self.state.looking_for
    };

    axios
      .post(url, payload)
      .then(function(response) {
        if (response.data !== undefined) {
          if (response.data.success) {
            self.props.history.push("/add-drug");
          }
        }
      })
      .catch(function(error) {});

    event.preventDefault();
  };

  toggleWChange = () => {
    this.setState({
      want_commercialise: !this.state.want_commercialise
    });
  };

  toggleLChange = () => {
    this.setState({
      looking_for: !this.state.looking_for
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
              <div className="form-group">
                <h4>Complete profile</h4>
                <div className="form-check text-left">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={this.state.looking_for}
                    onChange={this.toggleLChange}
                  />
                  <label className="form-check-label">
                    Iam looking for drugs
                  </label>
                </div>

                <div className="form-check text-left">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={this.state.want_commercialise}
                    onChange={this.toggleWChange}
                  />
                  <label className="form-check-label">
                    I want to commercialize my drug
                  </label>
                </div>

                <div className="input-group mt-2">
                  <label className="form-check-label mb-2">
                    What kind of drugs you are looking for?
                  </label>
                  <TagsInput
                    value={this.state.tags}
                    onChange={this.handleChange}
                    inputValue={this.state.tag}
                    onChangeInput={this.handleChangeInput}
                  />
                </div>
              </div>
              <div className="form-check mt-3">
                <button type="submit" value="Submit" className="btn btn-login">
                  Update
                </button>
              </div>
            </form>
          </div>
        </center>
      </React.Fragment>
    );
  }
}

export default CompleteProfile;
