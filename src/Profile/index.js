import React from "react";
// Graphql and APollo modules
import gql from "graphql-tag";
import { graphql } from "react-apollo";
// Display repository, get query fragments
import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
// Page loading animation
import Loading from "../Loading";
// Error handling
import ErrorMessage from "../Error";

// Query for user repositories
const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(first: 5, orderBy: { direction: DESC, field: STARGAZERS }) {
        edges {
          node {
            ...repository
          }
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

// Display repository of user
const Profile = ({ data, loading, error }) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }
  // Init viewer object with data from query
  const { viewer } = data;
  // Display repositories
  if (loading || !viewer) {
    return <Loading />;
  }
  // Display repositories
  return <RepositoryList repositories={viewer.repositories} />;
};

export default graphql(GET_REPOSITORIES_OF_CURRENT_USER)(Profile);
