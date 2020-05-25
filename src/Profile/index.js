import React from "react";
// Graphql and APollo modules
import gql from "graphql-tag";
import { graphql } from "react-apollo";
// Display repository
import RepositoryList from "../Repository";
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
            id
            name
            url
            descriptionHTML
            primaryLanguage {
              name
            }
            owner {
              login
              url
            }
            stargazers {
              totalCount
            }
            viewerHasStarred
            watchers {
              totalCount
            }
            viewerSubscription
          }
        }
      }
    }
  }
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
