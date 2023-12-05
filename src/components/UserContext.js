import React, { createContext, useContext, useEffect, useState } from 'react';
import { useServerURL } from './ServerURLContext';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, profileOwner }) => {
  const serverURL = useServerURL();
  const [businessName, setBusinessName] = useState(null);
  const [userCredits, setUserCredits] = useState(null);
  const [profession, setProfession] = useState();
  const [isBusiness, setIsBusiness] = useState(null);
  const [formattedBillingCycleEnd, setFormattedBillingCycleEndDate] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionCredits, setSubscriptionCredits] = useState(null);
  const [subscriptionProductId, setSubscriptionProductId] = useState(null);

  const fetchUserInfo = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/user/getUserInfo?profileOwner=${profileOwner}`);
      const data = await response.json();
  
      if ('businessName' in data.userInfo) {
        const { businessName, credits, profession, isBusiness } = data.userInfo;
        setBusinessName(businessName);
        setUserCredits(credits);
        setProfession(profession);
        setIsBusiness(isBusiness);

      } else {
        const { credits, profession, isBusiness, billingCycleEnd, subscription, subscriptionProductId, subscriptionCredits } = data.userInfo;
        setUserCredits(credits);
        setProfession(profession);
        setIsBusiness(isBusiness);

        const billingCycleEndTimestamp = billingCycleEnd;
        const billingCycleEndDate = new Date(billingCycleEndTimestamp._seconds * 1000);
        const month = (billingCycleEndDate.getMonth() + 1).toString().padStart(2, '0');
        const day = billingCycleEndDate.getDate().toString().padStart(2, '0');
        const year = billingCycleEndDate.getFullYear();
        setFormattedBillingCycleEndDate(`${month}/${day}/${year}`);

        setSubscription(subscription);
        setSubscriptionCredits(subscriptionCredits);
        setSubscriptionProductId(subscriptionProductId);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserInfo(profileOwner);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [profileOwner]);

  return (
    <UserContext.Provider 
      value={{ 
          businessName,
          userCredits,
          setUserCredits,
          profession,
          isBusiness,
          profileOwner,
          serverURL,
          formattedBillingCycleEnd,
          subscription,
          subscriptionProductId,
          subscriptionCredits,
        }}>
      {children}
    </UserContext.Provider>
  );
};
