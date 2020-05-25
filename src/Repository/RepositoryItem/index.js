import React from "react";
// Custom React Components
import Link from "../../Link";
import Button from "../../Button";
// Allow Graphql queries
import gql from "graphql-tag";
// Allow Graphql mutations
import { Mutation } from "react-apollo";
// Query fragments
import REPOSITORY_FRAGMENT from "../fragments";

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
        id
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
        id
        viewerSubscription
      }
    }
  }
`;

const updateAddStar = (
  client,
  {
    data: {
      addStar: {
        starrable: { id },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount + 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

const updateRemoveStar = (
  client,
  {
    data: {
      removeStar: {
        starrable: { id },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

const updateAddSubscription = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.watchers.totalCount + 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};
const updateRemoveSubscription = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.watchers.totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};

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
          <Mutation
            mutation={STAR_REPOSITORY}
            variables={{ id }}
            update={updateAddStar}
          >
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
              <Mutation
                mutation={REMOVE_STAR_REPOSITORY}
                variables={{ id }}
                update={updateRemoveStar}
              >
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
          <Mutation
            mutation={ADD_SUBSCRIPTION}
            variables={{ id }}
            update={updateAddSubscription}
          >
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
              <Mutation
                mutation={REMOVE_SUBSCRIPTION}
                variables={{ id }}
                update={updateRemoveSubscription}
              >
                {(removeSubscription, { data, loading, error }) => (
                  <Button
                    className={"RepositoryItem-title-action"}
                    onClick={removeSubscription}
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
