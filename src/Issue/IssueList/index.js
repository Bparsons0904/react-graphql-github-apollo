import React from "react";
// Apollo components
import { Query, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
// Allow for server side filtering
import { withState } from "recompose";
// Displays each individual issue
import IssueItem from "../IssueItem";
// Loading animation
import Loading from "../../Loading";
// Get next group of issues
import FetchMore from "../../FetchMore";
// Component for displaying error messages
import ErrorMessage from "../../Error";
// Borderless button
import { ButtonUnobtrusive } from "../../Button";

import "./style.css";

// Query to retrieve issues for each repo
const GET_ISSUES_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueState: IssueState!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState], after: $cursor) {
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
        pageInfo {
          endCursor
          hasNextPage
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

// Update cache of results to be displayed
const updateQuery = (previousResult, { fetchMoreResult }) => {
  // Display previous results if fetch does not retrieve more
  if (!fetchMoreResult) {
    return previousResult;
  }
  // Display previous results and newly fetched results
  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issues: {
        ...previousResult.repository.issues,
        ...fetchMoreResult.repository.issues,
        edges: [
          ...previousResult.repository.issues.edges,
          ...fetchMoreResult.repository.issues.edges,
        ],
      },
    },
  };
};

// Prefetch issue when issue button is hovered over
const prefetchIssues = (
  client,
  repositoryOwner,
  repositoryName,
  issueState
) => {
  const nextIssueState = TRANSITION_STATE[issueState];

  if (isShow(nextIssueState)) {
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState,
      },
    });
  }
};

// Query database for issues with each repo and display
const Issues = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}) => (
  <div className="Issues">
    {/* Generate prefetching button to display issues */}
    <IssueFilter
      repositoryOwner={repositoryOwner}
      repositoryName={repositoryName}
      issueState={issueState}
      onChangeIssueState={onChangeIssueState}
    />
    {/* If issue is in open or closed state, display issues */}
    {isShow(issueState) && (
      <Query
        query={GET_ISSUES_OF_REPOSITORY}
        variables={{
          repositoryOwner,
          repositoryName,
          issueState,
        }}
        notifyOnNetworkStatusChange={true}
      >
        {({ data, loading, error, fetchMore }) => {
          // If error display error message
          if (error) {
            return <ErrorMessage error={error} />;
          }

          // Set repository object to fetched data
          const { repository } = data;

          // If loading and no repository display loading animation
          if (loading && !repository) {
            return <Loading />;
          }

          // Filter issues based on current state selection
          const filteredRepository = {
            issues: {
              edges: repository.issues.edges.filter(
                (issue) => issue.node.state === issueState
              ),
            },
          };

          // If no issues for current state, display no issues message
          if (!filteredRepository.issues.edges.length) {
            return <div className="IssueList">No issues ...</div>;
          }

          return (
            <IssueList
              issues={repository.issues}
              loading={loading}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
              issueState={issueState}
              fetchMore={fetchMore}
            />
          );
        }}
      </Query>
    )}
  </div>
);

// Display show issue button
const IssueFilter = ({
  issueState,
  onChangeIssueState,
  repositoryOwner,
  repositoryName,
}) => (
  <ApolloConsumer>
    {(client) => (
      <ButtonUnobtrusive
        // On click toggle state of issue to display
        onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
        // On mouseover, prefetch issues
        onMouseOver={() =>
          prefetchIssues(client, repositoryOwner, repositoryName, issueState)
        }
      >
        {TRANSITION_LABELS[issueState]}
      </ButtonUnobtrusive>
    )}
  </ApolloConsumer>
);

// Display list
const IssueList = ({
  issues,
  loading,
  repositoryOwner,
  repositoryName,
  issueState,
  fetchMore,
}) => (
  <div className="IssueList">
    {/* Loop through issues, create element for each node */}
    {issues.edges.map(({ node }) => (
      <IssueItem
        key={node.id}
        issue={node}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
      />
    ))}

    {/* Generate button to fetch next group of issues. */}
    <FetchMore
      loading={loading}
      hasNextPage={issues.pageInfo.hasNextPage}
      variables={{
        cursor: issues.pageInfo.endCursor,
        repositoryOwner,
        repositoryName,
        issueState,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Issues
    </FetchMore>
  </div>
);

export default withState(
  "issueState",
  "onChangeIssueState",
  ISSUE_STATES.NONE
)(Issues);
