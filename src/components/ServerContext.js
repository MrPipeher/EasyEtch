import React, { createContext, useContext, useEffect, useState } from 'react';
import { useServerURL } from './ServerURLContext';

const ServerContext = createContext();

export const useServerContext = () => {
  return useContext(ServerContext);
};

export const ServerProvider = ({ children, profileOwner }) => {
  const [credits, setCredits] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const serverURL = useServerURL();

  const fetchAccountType = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/common/getAccountType?profileOwner=${profileOwner}`);
      const data = await response.json();
      setAccountType(data.accountType);
    } catch (error) {
      console.error('Error fetching account type:', error);
    }
  };

  const changeAccountType = async (profileOwner, newAccountType) => {

    //Prevent Spam
    if (newAccountType == accountType) return;

    try {
      const response = await fetch(`${serverURL}/common/changeAccountType`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          newAccountType: newAccountType
        })
      });
      const data = await response.json();
      setAccountType(data.updatedAccountType);
    } catch (error) {
      console.error('Error changing account type:', error);
    }
  };

  const fetchCredits = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/common/credits?profileOwner=${profileOwner}`);
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const reloadCredits = async () => {
    try {
      const creditsData = await fetchCredits(profileOwner);
      setCredits(creditsData);
    } catch (error) {
      console.error('Error reloading credits:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAccountType(profileOwner);
        await fetchCredits(profileOwner);
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };

    fetchData();
  }, [profileOwner]);

  return (
    <ServerContext.Provider 
      value={{ 
          serverURL,
          profileOwner,
          credits,
          setCredits,
          reloadCredits,
          accountType,
          changeAccountType
        }}>
      {children}
    </ServerContext.Provider>
  );
};
