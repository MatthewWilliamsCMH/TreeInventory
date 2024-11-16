import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

import App from "./App";
import Header from "./components/Header/Header";
import TreeForm from "./components/TreeForm/TreeForm";
import TreeInventory from "./components/TreeInventory/TreeInventory";
import TreeMap from "./components/TreeMap/TreeMap";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/TreeForm",
    element: <TreeForm />
  },
  {
    path: "/TreeInventory",
    element: <TreeInventory />
  },
  //I think is is probably not necessary because <App /> takes the user to the home page, which is the map
  {
    path: "/TreeMap",
    element: <TreeMap />
  }
]);

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql"
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

//wraps app with apollo provider
createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <Header />
    <RouterProvider router={router} />
  </ApolloProvider>
);