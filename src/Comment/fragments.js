import gql from "graphql-tag";

// Fragment to get Issue for comment update
export const ISSUE_FRAGMENT = gql`
  fragment issue on Issue {
    id
    comments(first: 5, after: $cursor) {
      edges {
        node {
          bodyText
          id
          author {
            login
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export default ISSUE_FRAGMENT;
