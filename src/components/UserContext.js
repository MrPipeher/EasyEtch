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
  const [status, setStatus] = useState(null);
  const [maxCredits, setMaxCredits] = useState(null);
  const [tier, setTier] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState(null);

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

        await fetchUserSubscription(profileOwner, profession);
      } else {
        const { credits, profession, isBusiness } = data.userInfo;
        setUserCredits(credits);
        setProfession(profession);
        setIsBusiness(isBusiness);

        await fetchUserSubscription(profileOwner, profession);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserSubscription = async (profileOwner, profession) => {
    try {
      const response = await fetch(`${serverURL}/user/getUserSubscription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          subscriptionType: profession,
        }),
      });

      const data = await response.json();
      const { billingCycleEnd, status, credits, tier, subscriptionType } = data.subData;

      const billingCycleEndTimestamp = billingCycleEnd;
      const billingCycleEndDate = new Date(billingCycleEndTimestamp._seconds * 1000);
      const month = (billingCycleEndDate.getMonth() + 1).toString().padStart(2, '0');
      const day = billingCycleEndDate.getDate().toString().padStart(2, '0');
      const year = billingCycleEndDate.getFullYear();
      setFormattedBillingCycleEndDate(`${month}/${day}/${year}`);

      setStatus(status);
      setMaxCredits(credits);
      setTier(tier);
      setSubscriptionType(subscriptionType);

    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  }

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
          status,
          maxCredits,
          tier,
          subscriptionType,
        }}>
      {children}
    </UserContext.Provider>
  );
};
