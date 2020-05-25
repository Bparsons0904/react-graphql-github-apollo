import React from "react";
// Graphql and APollo modules
import gql from "graphql-tag";
import { Query } from "react-apollo";
// Display repository, get query fragments
import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
// Page loading animation
import Loading from "../Loading";
// Error handling
import ErrorMessage from "../Error";

// Query for user repositories
const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
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

const Profile = () => (
  <Query
    query={GET_REPOSITORIES_OF_CURRENT_USER}
    // Indicates a query has started, begins loading animation
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      // If error display error message
      if (error) {
        return <ErrorMessage error={error} />;
      }
      // Init viewer object with data from query
      const { viewer } = data;

      // If loading and no viewer, display loading animation
      if (loading && !viewer) {
        return <Loading />;
      }

      // Display list of repos
      return (
        <RepositoryList
          loading={loading}
          repositories={viewer.repositories}
          fetchMore={fetchMore}
        />
      );
    }}
  </Query>
);

export default Profile;
