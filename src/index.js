import React from "react";
import ReactDOM from "react-dom";

// Apollo imports
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RetryLink } from "apollo-link-retry";

import registerServiceWorker from "./registerServiceWorker";
import App from "./App";

import "./style.css";

// URL for Apollo connection
const GITHUB_BASE_URL = "https://api.github.com/graphql";

// Set configuration for apollo
const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

// Errors for link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("GraphQL Error");
  }

  if (networkError) {
    console.log("Network Error");
  }
});

// Create link for error control
const link = ApolloLink.from([new RetryLink(), errorLink, httpLink]);
// Store results of query
const cache = new InMemoryCache();
// Create client class for Apollo
const client = new ApolloClient({
  link,
  cache,
});
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

registerServiceWorker();
