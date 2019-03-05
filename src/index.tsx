import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { resolvers as localResolvers,
         defaults as localDefaults,
         schema as localTypeDefs } from './graphql/local/state';

import './index.css';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({
  uri: 'http://localhost:8529/_db/_system/land'
});

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: localDefaults,
  resolvers: localResolvers,
  typeDefs: localTypeDefs,
});

const client = new ApolloClient({
  link: ApolloLink.from([stateLink, httpLink]),
  // TODO: Find why there is a duplicaton of the following
  //       fields whith stateLink.
  cache,
  resolvers: localResolvers,
  typeDefs: localTypeDefs,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
