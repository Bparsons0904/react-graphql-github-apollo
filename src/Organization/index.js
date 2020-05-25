import React from "react";
// Graphql and APollo modules
import gql from "graphql-tag";
import { Query, skip } from "react-apollo";
// Display repository, get query fragments
import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
// Page loading animation
import Loading from "../Loading";
// Error handling
import ErrorMessage from "../Error";

// Query for searched organization repositories
const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
      repositories(first: 5, after: $cursor) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${REPOSITORY_FRAGMENT}
`;

const Organization = ({ organizationName }) => (
  <Query
    query={GET_REPOSITORIES_OF_ORGANIZATION}
    variables={{
      organizationName,
    }}
    // Skip query if organization name is empty
    skip={organizationName === ""}
    // Indicates a query has started, begins loading animation
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      // If error display error message
      if (error) {
        return <ErrorMessage error={error} />;
      }
      // Init organization object with data from query
      const { organization } = data;
      // If loading and no viewer, display loading animation
      if (loading && !organization) {
        return <Loading />;
      }
      // Display list of organization repos
      return (
        <RepositoryList
          loading={loading}
          repositories={organization.repositories}
          fetchMore={fetchMore}
          entry={"organization"}
        />
      );
    }}
  </Query>
);

export default Organization;
