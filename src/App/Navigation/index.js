import React from "react";
// Generate clickable routes through links
import { Link, withRouter } from "react-router-dom";
import * as routes from "../../constants/routes";
// Create buttons
import Button from "../../Button";
// Include user input search field
import Input from "../../Input";

import "./style.css";

// Page Header with navigation and search
const Navigation = ({
  location: { pathname },
  organizationName,
  onOrganizationSearch,
}) => (
  <header className="Navigation">
    <div className="Navigation-link">
      <Link to={routes.PROFILE}>Profile</Link>
    </div>
    <div className="Navigation-link">
      <Link to={routes.ORGANIZATION}>Organization</Link>
    </div>

    {pathname === routes.ORGANIZATION && (
      <OrganizationSearch
        organizationName={organizationName}
        onOrganizationSearch={onOrganizationSearch}
      />
    )}
  </header>
);

// Search class
class OrganizationSearch extends React.Component {
  // Store value of organization name to search
  state = {
    value: this.props.organizationName,
  };

  // Update state on each change of value of input
  onChange = (event) => {
    this.setState({ value: event.target.value });
  };

  // Send search value to organization component for search
  onSubmit = (event) => {
    this.props.onOrganizationSearch(this.state.value);
    // Prevent default behavior: reload
    event.preventDefault();
  };

  // Display the value with any updates
  render() {
    const { value } = this.state;

    return (
      <div className="Navigation-search">
        <form onSubmit={this.onSubmit}>
          <Input
            color={"white"}
            type="text"
            value={value}
            onChange={this.onChange}
          />{" "}
          <Button color={"white"} type="submit">
            Search
          </Button>
        </form>
      </div>
    );
  }
}

export default withRouter(Navigation);
