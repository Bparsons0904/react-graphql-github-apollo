import React, { Fragment } from "react";
// Retrieve next group of repos
import FetchMore from "../../FetchMore";
// Display individual repository
import RepositoryItem from "../RepositoryItem";
import "../style.css";

// Update cache of results to be displayed
const updateQuery = (previousResult, { fetchMoreResult }) => {
  // Display previous results if fetch does not retrieve more
  if (!fetchMoreResult) {
    return previousResult;
  }

  // Display previous results and newly fetched results
  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};

// Loop through list of repositories and generate each item
const RepositoryList = ({ repositories, loading, fetchMore }) => (
  <Fragment>
    {/* Loop through the nodes, create repo item for each  */}
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))}

    {/* Display a fetch more button, request updated query with additional results */}
    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Fragment>
);

export default RepositoryList;
