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

// Query database for issues with each repo and display
const Issues = ({ repositoryOwner, repositoryName }) => (
  <Query
    query={GET_ISSUES_OF_REPOSITORY}
    variables={{
      repositoryOwner,
      repositoryName,
    }}
  >
    {({ data, loading, error }) => {
      // If error display error message
      if (error) {
        return <ErrorMessage error={error} />;
      }
      // Init repository object with data from query
      const { repository } = data;

      // If loading and no repository, display loading animation
      if (loading && !repository) {
        return <Loading />;
      }

      // If no issues were found, return element
      if (!repository.issues.edges.length) {
        return <div className="IssueList">No issues ...</div>;
      }

      // Return items as a IssueList
      return <IssueList issues={repository.issues} />;
    }}
  </Query>
);

// Loop through issues creating elements for display using IssueItem component
const IssueList = ({ issues }) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </div>
);

export default Issues;
