import React from "react";
// Graphql and APollo modules
import gql from "graphql-tag";
import { Query } from "react-apollo";
// Display repository
import RepositoryList from "../Repository";
// Page loading animation
import Loading from "../Loading";

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
const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
    {({ data, loading }) => {
      const { viewer } = data;

      // If data still being retrieved, display loader
      if (loading || !viewer) {
        return <Loading />;
      }

      // Display repositories
      return <RepositoryList repositories={viewer.repositories} />;
    }}
  </Query>
);

export default Profile;
