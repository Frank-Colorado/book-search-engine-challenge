import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  defaultDataIdFromObject,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// All component imports
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// Setting up Apollo Client
const httpLink = createHttpLink({
  uri: "/graphql",
});

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        savedBooks: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },

  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case "User":
        return object._id;
      default:
        return defaultDataIdFromObject(object);
    }
  },
});

const authLink = setContext((_, { headers }) => {
  // Get token from local storage
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Linking to the server
  link: authLink.concat(httpLink),
  cache: cache,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
};

export default App;
