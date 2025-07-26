import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useOutletContext,
} from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';

import App from './App.jsx';
import TreeMap from './components/TreeMap/TreeMap.jsx';
import TreeData from './components/TreeData/TreeData.jsx';
import TreeInventory from './components/TreeInventory/TreeInventory.jsx';

const graphqlUrl =
  import.meta.env.VITE_GRAPHQL_URL || 'https://localhost:3001/graphql';

const httpLink = createHttpLink({
  uri: graphqlUrl,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const TreeDataRoute = () => {
  const { updatedTree } = useOutletContext(); // Using context passed from App.jsx

  if (!updatedTree) {
    return <Navigate to='/' />;
  }

  return <TreeData updatedTree={updatedTree} />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <TreeMap />,
      },
      {
        path: '/TreeData',
        element: <TreeDataRoute />,
      },
      {
        path: '/inventory',
        element: <TreeInventory />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
