import React from "react";
// Apollo components
import { Query } from "react-apollo";
import gql from "graphql-tag";
// Displays each individual issue
import IssueItem from "../IssueItem";
// Loading animation
import Loading from "../../Loading";
// Component for displaying error messages
import ErrorMessage from "../../Error";
// Borderless button
import { ButtonUnobtrusive } from "../../Button";
import "./style.css";

// Query to retrieve issues for each repo
const GET_ISSUES_OF_REPOSITORY = gql`
  query($repositoryOwner: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

// Available states for issues
const ISSUE_STATES = {
  NONE: "NONE",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
};

// Labels to display for each type of state
const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: "Show Open Issues",
  [ISSUE_STATES.OPEN]: "Show Closed Issues",
  [ISSUE_STATES.CLOSED]: "Hide Issues",
};

// From to state for each state
const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

// Variable to determine is stats should be visible
const isShow = (issueState) => issueState !== ISSUE_STATES.NONE;

// Query database for issues with each repo and display
class Issues extends React.Component {
  // Default to no issues displayed
  state = {
    issueState: ISSUE_STATES.NONE,
  };

  // On button click, determine next state to display
  onChangeIssueState = (nextIssueState) => {
    this.setState({ issueState: nextIssueState });
  };

  render() {
    const { issueState } = this.state;
    const { repositoryOwner, repositoryName } = this.props;

    return (
      <div className="Issues">
        {/* Toggle through available states of issues */}
        <ButtonUnobtrusive
          onClick={() => this.onChangeIssueState(TRANSITION_STATE[issueState])}
        >
          {TRANSITION_LABELS[issueState]}
        </ButtonUnobtrusive>

        {isShow(issueState) && (
          <Query
            query={GET_ISSUES_OF_REPOSITORY}
            variables={{
              repositoryOwner,
              repositoryName,
            }}
          >
            {({ data, loading, error }) => {
              // Display error message if error returned
              if (error) {
                return <ErrorMessage error={error} />;
              }

              // Init repository object to values from data
              const { repository } = data;

              // Display loading animation if loading and no loaded repository
              if (loading && !repository) {
                return <Loading />;
              }

              // Display issues that match currently selected state.
              const filteredRepository = {
                issues: {
                  edges: repository.issues.edges.filter(
                    (issue) => issue.node.state === issueState
                  ),
                },
              };

              // If not issues for current state, display message
              if (!filteredRepository.issues.edges.length) {
                return <div className="IssueList">No issues ...</div>;
              }

              // Display issues using Issuelist component
              return <IssueList issues={filteredRepository.issues} />;
            }}
          </Query>
        )}
      </div>
    );
  }
}

// Loop through issues and display
const IssueList = ({ issues }) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </div>
);

export default Issues;
