import React, { Component } from "react";
// React router classes and methods
import { BrowserRouter as Router, Route } from "react-router-dom";
// Available route components
import Navigation from "./Navigation";
import Profile from "../Profile";
import Organization from "../Organization";
// Contacts used for routes
import * as routes from "../constants/routes";

import "./style.css";

class App extends Component {
  // Set init organizational state value
  state = {
    organizationName: "the-road-to-learn-react",
  };

  onOrganizationSearch = (value) => {
    this.setState({ organizationName: value });
  };

  render() {
    const { organizationName } = this.state;

    return (
      <Router>
        <div className="App">
          <Navigation
            organizationName={organizationName}
            onOrganizationSearch={this.onOrganizationSearch}
          />

          <div className="App-main">
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="App-content_large-header">
                  <Organization organizationName={organizationName} />
                </div>
              )}
            />
            <Route
              exact
              path={routes.PROFILE}
              component={() => (
                <div className="App-content_small-header">
                  <Profile />
                </div>
              )}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
