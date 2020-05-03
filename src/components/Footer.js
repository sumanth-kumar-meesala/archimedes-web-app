import React, { Component } from "react";
import "bootstrap/dist/js/bootstrap.min";
import "popper.js";
import { mdiFacebook, mdiTwitter, mdiInstagram } from "@mdi/js";
import Icon from "@mdi/react";

class Footer extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <footer className="footer text-center bg-dark">
          <div className="container">
            <ul className="list-inline mb-5">
              <li className="list-inline-item">
                <a
                  className="social-link rounded-circle text-white mr-3"
                  href="#"
                >
                  <Icon
                    path={mdiFacebook}
                    size={1}
                    horizontal
                    vertical
                    color="#fff"
                    rotate={180}
                  />
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  className="social-link rounded-circle text-white mr-3"
                  href="#"
                >
                  <Icon
                    path={mdiTwitter}
                    size={1}
                    horizontal
                    vertical
                    color="#fff"
                    rotate={180}
                  />
                </a>
              </li>
              <li className="list-inline-item">
                <a className="social-link rounded-circle text-white" href="#">
                  <Icon
                    path={mdiInstagram}
                    size={1}
                    horizontal
                    vertical
                    color="#fff"
                    rotate={180}
                  />
                </a>
              </li>
            </ul>
            <p className="text-muted small mb-0">
              Copyright &copy; Your Website 2018
            </p>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Footer;
