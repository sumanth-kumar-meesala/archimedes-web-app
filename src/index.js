import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import TGASearch from "./components/TGASearch";
import MalacardsSearch from "./components/MalacardsSearch";
import TGADetails from "./components/TGADetails";
import MalacardsDetails from "./components/MalacardsDetails";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import UserSearch from "./components/UserSearch";
import AddDrug from "./components/AddDrug";
import Payment from "./components/Payment";
import ReactGA from "react-ga";
import CompleteProfile from "./components/CompleteProfile";

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/user-search" component={UserSearch} />
      <PrivateRoute path="/chat" component={Chat} />
      <PrivateRoute path="/tga-search" component={TGASearch} />
      <PrivateRoute path="/malacards-search" component={MalacardsSearch} />
      <PrivateRoute path="/tga/:id" component={TGADetails} />
      <PrivateRoute path="/malacards/:id" component={MalacardsDetails} />
      <PrivateRoute path="/add-drug" component={AddDrug} />
      <PrivateRoute path="/premium" component={Payment} />
      <PrivateRoute path="/complete-profile" component={CompleteProfile} />
    </div>
  </Router>,
  document.getElementById("root")
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("access-token") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
