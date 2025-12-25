//----------Import----------
//external libraries
import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';

//local components
import AppContext from './appContext.js';
import App from './App.jsx';
import TreeData from './components/TreeData/TreeData.jsx';
import TreeDetails from './components/TreeDetails/TreeDetails.jsx';
import TreeInventory from './components/TreeInventory/TreeInventory.jsx';
import TreeMap from './components/TreeMap/TreeMap.jsx';

//----------Initialize Global Environment----------
//define GraphQL endpoint
const graphqlUrl =
  import.meta.env.VITE_GRAPHQL_URL ||
  (import.meta.env.NODE_ENV === 'production'
    ? 'https://sctrees.vercel.app/api/graphql'
    : 'http://localhost:3001/graphql');

//configure Apollo Client link
const httpLink = createHttpLink({
  uri: graphqlUrl,
});

//initialize Apollo Client instance with the link and cache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

//----------Define Route Wrapper Components----------
const TreeDataRoute = () => {
  //access global state
  const { selectedTree } = useContext(AppContext);

  //if no tree selected, redirect to home page
  if (!selectedTree) {
    return <Navigate to='/' />;
  }

  //otherwise, render component with required prop
  return <TreeData selectedTree={selectedTree} />;
};

//wrapper component to protect TreeDetails route
const TreeDetailsRoute = () => {
  //access global state
  const { selectedTree } = useContext(AppContext);

  //if no tree selected, redirect to home page
  if (!selectedTree) {
    return <Navigate to='/' />;
  }

  //otherwise, render component with required prop
  return <TreeDetails selectedTree={selectedTree} />;
};

//----------Configure Router----------
//reate browser router instance with defined routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <TreeMap /> },
      { path: 'TreeData', element: <TreeDataRoute /> },
      { path: 'TreeDetails', element: <TreeDetailsRoute /> },
      { path: 'TreeInventory', element: <TreeInventory /> },
    ],
  },
]);

//----------Mount Application----------
//render application wrapped in necessary providers (Apollo and Router)
createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
