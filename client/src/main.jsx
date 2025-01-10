import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";

import App from "./App";
import TreeMap from "./components/TreeMap/TreeMap";
import TreeData from "./components/TreeData/TreeData";
import TreeInventory from "./components/TreeInventory/TreeInventory";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:3001/graphql"
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <TreeMap /> 
      },
      {
        path: "/TreeData",
        element: <TreeData />
      },
      {
        path: "/inventory",
        element: <TreeInventory />
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>
);