import React, { Fragment } from "react";
// Apollo components
import { Query, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
// Displays each individual issue
import CommentItem from "../CommentItem";
import CommentAdd from "../CommentAdd";
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
export const GET_COMMENTS_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueNumber: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $issueNumber) {
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
    }
  }
`;

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
      issue: {
        ...previousResult.repository.issue,
        ...fetchMoreResult.repository.issue,
        comments: {
          ...previousResult.repository.issue.comments,
          ...fetchMoreResult.repository.issue.comments,
          edges: [
            ...previousResult.repository.issue.comments.edges,
            ...fetchMoreResult.repository.issue.comments.edges,
          ],
        },
      },
    },
  };
};

// Prefetch issue when issue button is hovered over
const prefetchComments = (
  client,
  repositoryOwner,
  repositoryName,
  issueNumber
) => {
  client.query({
    query: GET_COMMENTS_OF_REPOSITORY,
    variables: {
      repositoryOwner,
      repositoryName,
      issueNumber,
    },
  });
};

class Comments extends React.Component {
  state = {
    showComments: false,
  };

  render() {
    const { showComments } = this.state;
    const { repositoryOwner, repositoryName, issueNumber } = this.props;

    return (
      // Query database for issues with each repo and display
      <div className="Comments">
        {/* Generate prefetching button to display issues */}
        <ApolloConsumer>
          {(client) => (
            <ButtonUnobtrusive
              className="comment-toggle"
              // On mouseover, prefetch issues
              onClick={() => {
                this.setState({ showComments: !this.state.showComments });
              }}
              // On mouseover, prefetch issues
              onMouseOver={() =>
                prefetchComments(
                  client,
                  repositoryOwner,
                  repositoryName,
                  issueNumber
                )
              }
            >
              {/* Text for Comments toggle button based on state */}
              {showComments ? "Hide Comments" : "Show Comments"}
            </ButtonUnobtrusive>
          )}
        </ApolloConsumer>
        {showComments && (
          <Query
            query={GET_COMMENTS_OF_REPOSITORY}
            variables={{
              repositoryOwner,
              repositoryName,
              issueNumber,
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

              // If no comments for current state, display no comments message
              if (!repository.issue.comments.edges.length) {
                return (
                  <div className="No-Comment-Container">
                    <div className="CommentsList">No comments ...</div>
                    {/* Include Textarea to add comment */}
                    <CommentAdd issueId={repository.issue.id} />
                  </div>
                );
              }

              return (
                <Fragment>
                  <CommentList
                    comments={repository.issue.comments}
                    loading={loading}
                    repositoryOwner={repositoryOwner}
                    repositoryName={repositoryName}
                    issueNumber={issueNumber}
                    fetchMore={fetchMore}
                  />
                  {/* Include Textarea to add comment */}
                  <CommentAdd issueId={repository.issue.id} />
                </Fragment>
              );
            }}
          </Query>
        )}
      </div>
    );
  }
}

// Display Comments
const CommentList = ({
  comments,
  loading,
  repositoryOwner,
  repositoryName,
  issueNumber,
  fetchMore,
}) => (
  <div className="CommentList">
    {/* Loop through comments, create element for each node */}
    {comments.edges.map(({ node }) => (
      <CommentItem key={node.id} comment={node} />
    ))}

    {/* Generate button to fetch next group of comments. */}
    <FetchMore
      loading={loading}
      hasNextPage={comments.pageInfo.hasNextPage}
      variables={{
        cursor: comments.pageInfo.endCursor,
        repositoryOwner,
        repositoryName,
        issueNumber,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Comments
    </FetchMore>
  </div>
);

export default Comments;
