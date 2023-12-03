import React, { createContext, useContext, useEffect, useState } from 'react';
import { useServerURL } from './ServerURLContext';

const ServerContext = createContext();

export const useServerContext = () => {
  return useContext(ServerContext);
};

export const ServerProvider = ({ children, profileOwner }) => {
  const serverURL = useServerURL();
  const [accountType, setAccountType] = useState(null);

  const fetchAccountType = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/common/getAccountType?profileOwner=${profileOwner}`);
      const data = await response.json();
      setAccountType(data.accountType);
    } catch (error) {
      console.error('Error fetching account type:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAccountType(profileOwner);
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };

    fetchData();
  }, [profileOwner]);

  return (
    <ServerContext.Provider 
      value={{ 
          accountType,
          serverURL,
          profileOwner,
        }}>
      {children}
    </ServerContext.Provider>
  );
};
