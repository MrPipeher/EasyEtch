import React, { createContext, useContext } from 'react';

const ServerURLContext = createContext();

export const useServerURL = () => {
  return useContext(ServerURLContext);
};

export const ServerURLProvider = ({ children, serverURL }) => {
  return (
    <ServerURLContext.Provider value={serverURL}>
      {children}
    </ServerURLContext.Provider>
  );
};
