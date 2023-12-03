import React, { createContext, useContext, useEffect, useState } from 'react';
import { useServerURL } from './ServerURLContext';

const BusinessContext = createContext();

export const useBusinessContext = () => {
  return useContext(BusinessContext);
};

export const BusinessProvider = ({ children, profileOwner }) => {
  const serverURL = useServerURL();
  const [businessName, setBusinessName] = useState(null);
  const [currentUsers, setCurrentUsers] = useState(null);
  const [userAmount, setUserAmount] = useState(null);
  const [credits, setCredits] = useState(null);

  const fetchBusinessInfo = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/business/getBusinessInfo?profileOwner=${profileOwner}`);
      const data = await response.json();
      setBusinessName(data.businessName);
      setCurrentUsers(data.currentUsers);
      setUserAmount(data.userAmount);
      setCredits(data.credits);
    } catch (error) {
      console.error('Error fetching account type:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBusinessInfo(profileOwner);
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };

    fetchData();
  }, [profileOwner]);

  return (
    <BusinessContext.Provider 
      value={{ 
          businessName,
          currentUsers,
          userAmount,
          credits,
          profileOwner,
          serverURL,
        }}>
      {children}
    </BusinessContext.Provider>
  );
};
