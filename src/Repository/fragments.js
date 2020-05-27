import gql from "graphql-tag";

export const REPOSITORY_FRAGMENT = gql`
  fragment repository on Repository {
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
`;

// Fragment to get Issue for comment update
export const GET_ISSUE_OF_REPOSITORY = gql`
  fragment issue on Issue {
    id
    comments {
      edges {
        node {
          body
        }
      }
    }
  }
`;

export default REPOSITORY_FRAGMENT;
