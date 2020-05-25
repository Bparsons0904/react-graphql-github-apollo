import React from "react";
// Custom React Components
import Link from "../../Link";
import Button from "../../Button";
// Allow Graphql queries
import gql from "graphql-tag";
// Allow Graphql mutations
import { Mutation, graphql } from "react-apollo";

import "../style.css";

// Add star to repo
const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

// Remove star from repo
const REMOVE_STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

// Subscribe to repo
const ADD_SUBSCRIPTION = gql`
  mutation($id: ID!) {
    updateSubscription(input: { subscribableId: $id, state: SUBSCRIBED }) {
      subscribable {
        viewerSubscription
      }
    }
  }
`;

// Unsubscribe from repo
const REMOVE_SUBSCRIPTION = gql`
  mutation($id: ID!) {
    updateSubscription(input: { subscribableId: $id, state: UNSUBSCRIBED }) {
      subscribable {
        viewerSubscription
      }
    }
  }
`;

// Data obtained from query from repository items
const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>
      <div>
        {/* If viewer has not starred repo display remove star button else display
        add star button */}
        {!viewerHasStarred ? (
          <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
            {(addStar, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={addStar}
              >
                {stargazers.totalCount} Star
              </Button>
            )}
          </Mutation>
        ) : (
          <span>
            {
              <Mutation mutation={REMOVE_STAR_REPOSITORY} variables={{ id }}>
                {(removeStar, { data, loading, error }) => (
                  <Button
                    className={"RepositoryItem-title-action"}
                    onClick={removeStar}
                  >
                    {stargazers.totalCount} Unstar
                  </Button>
                )}
              </Mutation>
            }
          </span>
        )}
        {/* If viewer has not subscribed to repo, display subscribable button else display remove subscription */}
        {viewerSubscription === "UNSUBSCRIBED" ? (
          <Mutation mutation={ADD_SUBSCRIPTION} variables={{ id }}>
            {(addSubscription, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={addSubscription}
              >
                {watchers.totalCount} Subscribe
              </Button>
            )}
          </Mutation>
        ) : (
          <span>
            {
              <Mutation mutation={REMOVE_SUBSCRIPTION} variables={{ id }}>
                {(removeSubcription, { data, loading, error }) => (
                  <Button
                    className={"RepositoryItem-title-action"}
                    onClick={removeSubcription}
                  >
                    {watchers.totalCount} Unsubscribe
                  </Button>
                )}
              </Mutation>
            }
          </span>
        )}
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
