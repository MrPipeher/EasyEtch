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
  const [status, setStatus] = useState(null);
  const [usage, setUsage] = useState(null);
  const [limit, setLimit] = useState(null);
  const [tier, setTier] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [formattedBillingCycleEnd, setFormattedBillingCycleEndDate] = useState(null);

  const fetchAccountType = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/common/getAccountType?profileOwner=${profileOwner}`);
      const data = await response.json();
      setAccountType(data.accountType);
      fetchSubscriptionData(profileOwner, data.accountType);
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
      fetchSubscriptionData(profileOwner, data.updatedAccountType);
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

  const fetchSubscriptionData = async (profileOwner, accountType) => {
    try {
      const response = await fetch(`${serverURL}/common/getSubscription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          subscriptionType: accountType,
        }),
      });

      const data = await response.json();
      const { billingCycleEnd, status, usage, limit, tier, subscriptionType } = data.subData;

      const billingCycleEndTimestamp = billingCycleEnd;
      const billingCycleEndDate = new Date(billingCycleEndTimestamp._seconds * 1000);
      const month = (billingCycleEndDate.getMonth() + 1).toString().padStart(2, '0');
      const day = billingCycleEndDate.getDate().toString().padStart(2, '0');
      const year = billingCycleEndDate.getFullYear();
      setFormattedBillingCycleEndDate(`${month}/${day}/${year}`);

      setStatus(status);
      setUsage(usage);
      setLimit(limit);
      setTier(tier);
      setSubscriptionType(subscriptionType);

    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  }

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
          accountType,
          changeAccountType,
          formattedBillingCycleEnd,
          status,
          setStatus,
          usage,
          setUsage,
          limit,
          setLimit,
          tier,
          setTier,
          subscriptionType,
          setSubscriptionType,
        }}>
      {children}
    </ServerContext.Provider>
  );
};
