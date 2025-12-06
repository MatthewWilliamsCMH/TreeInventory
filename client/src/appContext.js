//----------Import----------
//external libraries
import { createContext } from 'react';

//----------Create Context----------
/**
 * AppContext provides global state and functions throughout the application.
 * Initialized with 'null' as a default value.
 * Components must be wrapped in an AppContext.Provider higher up in the tree (usually App.jsx)
 * to access the actual context values.
 */
const AppContext = createContext(null);

export default AppContext;
