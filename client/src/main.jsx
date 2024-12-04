import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import App from "./App";
import TreeMap from "./components/TreeMap/TreeMap";
import PhysicalDataForm from "./components/PhysicalData/PhysicalDataForm";
import SiteDataForm from "./components/SiteData/SiteDataForm";
import CareDataForm from "./components/CareData/CareDataForm";
import TreeInventory from "./components/TreeInventory/TreeInventory";

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql"
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
        path: "physicaldata",
        element: <PhysicalDataForm />
      },
      {
        path: "sitedata",
        element: <SiteDataForm />
      },
      {
        path: "caredata",
        element: <CareDataForm />
      },
      {
        path: "inventory",
        element: <TreeInventory />
      }
    ]
  }
]);

//wraps app with apollo provider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>
);