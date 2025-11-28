import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';

import AppContext from './appContext.js';
import App from './App.jsx';
import TreeData from './components/TreeData/TreeData.jsx';
import TreeDetails from './components/TreeDetails/TreeDetails.jsx';
import TreeInventory from './components/TreeInventory/TreeInventory.jsx';
import TreeMap from './components/TreeMap/TreeMap.jsx';

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || 'https://localhost:3001/graphql';

const httpLink = createHttpLink({
  uri: graphqlUrl,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const TreeDataRoute = () => {
  const { selectedTree } = useContext(AppContext); // Using context passed from App.jsx

  if (!selectedTree) {
    return <Navigate to='/' />;
  }

  return <TreeData selectedTree={selectedTree} />;
};

const TreeDetailsRoute = () => {
  const { selectedTree } = useContext(AppContext); // Using context passed from App.jsx

  if (!selectedTree) {
    return <Navigate to='/' />;
  }

  return <TreeDetails selectedTree={selectedTree} />;
};

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

createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
