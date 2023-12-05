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
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [formattedBillingCycleEnd, setFormattedBillingCycleEndDate] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionCredits, setSubscriptionCredits] = useState(null);
  const [subscriptionProductId, setSubscriptionProductId] = useState(null);

  const fetchBusinessInfo = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/business/getBusinessInfo?profileOwner=${profileOwner}`);
      const data = await response.json();
      const { businessName, currentUsers, userAmount, credits, billingCycleEnd, subscription, subscriptionProductId, subscriptionCredits  } = data.businessInfo;
      setBusinessName(businessName);
      setCurrentUsers(currentUsers);
      setUserAmount(userAmount);
      setCredits(credits);

      const billingCycleEndTimestamp = billingCycleEnd;
      const billingCycleEndDate = new Date(billingCycleEndTimestamp._seconds * 1000);
      const month = (billingCycleEndDate.getMonth() + 1).toString().padStart(2, '0');
      const day = billingCycleEndDate.getDate().toString().padStart(2, '0');
      const year = billingCycleEndDate.getFullYear();
      setFormattedBillingCycleEndDate(`${month}/${day}/${year}`);

      setSubscription(subscription);
      setSubscriptionCredits(subscriptionCredits);
      setSubscriptionProductId(subscriptionProductId);
    } catch (error) {
      console.error('Error fetching account type:', error);
    }
  };

  const fetchProfiles = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/business/getProfiles?profileOwner=${profileOwner}`);
      if (!response.ok) {
        throw new Error(`HTTP error!`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      const response = await fetch(`${serverURL}/business/updateprofile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          profileId: updatedProfile.email,
          updatedProfileData: updatedProfile
        })
      });

      if (response.ok) {
        console.log('Profile updated successfully!');
        const updatedProfiles = profiles.map(profile =>
          profile.email === updatedProfile.email ? updatedProfile : profile
        );
        setProfiles(updatedProfiles);
        setSelectedProfile(updatedProfile);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const deleteProfile = async (profileId) => {
    try {
      const response = await fetch(`${serverURL}/business/deleteprofile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          profileId: profileId
        })
      });

      if (response.ok) {
        console.log('Profile deleted successfully!');
        const updatedProfiles = profiles.filter(profile => profile.profileId !== profileId);
        setProfiles(updatedProfiles);
        if (selectedProfile && selectedProfile.profileId === profileId) {
          setSelectedProfile(null);
        }
      } else {
        console.error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const giveProfileCredits = async (selectedProfile, amount) => {

    if (credits < amount) {
      console.log('Not enough credits to perform the operation.');
      return;
    }

    try {
      const response = await fetch(`${serverURL}/business/giveProfileCredits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          profileId: selectedProfile.email,
          amount: amount,
        })
      });

      if (response.ok) {
        const data = await response.json();

        setCredits(data.businessCredits);
        setProfiles(prevProfiles => {
          return prevProfiles.map(profile =>
            profile.email === selectedProfile.email
              ? { ...profile, credits: data.userCredits }
              : profile
          );
        });
        setSelectedProfile(prevProfile => ({
          ...prevProfile,
          credits: data.userCredits,
        }));
        
      } else {
        console.error('Failed to give profile credits.');
      }
    } catch (error) {
      console.error('Error adding credits to profile:', error);
    }
  };

  const removeProfileCredits = async (selectedProfile, amount) => {

    if (selectedProfile.credits < amount) {
      console.log('Not enough credits to perform the operation.');
      return;
    }

    try {
      const response = await fetch(`${serverURL}/business/removeProfileCredits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          profileId: selectedProfile.email,
          amount: amount,
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        setCredits(data.businessCredits);
        setProfiles(prevProfiles => {
          return prevProfiles.map(profile =>
            profile.email === selectedProfile.email
              ? { ...profile, credits: data.userCredits }
              : profile
          );
        });
        setSelectedProfile(prevProfile => ({
          ...prevProfile,
          credits: data.userCredits,
        }));
      } else {
        console.error('Failed to remove profile credits.');
      }
    } catch (error) {
      console.error('Error removing credits from profile:', error);
    }
  };

  const handleGiveAllCredits = async () => {

    if (credits < profiles.length) {
      console.log('Not enough credits to perform the operation.');
      return;
    }

    try {
      const response = await fetch(`${serverURL}/business/giveAllCredits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedCredits = data.updatedCredits;
        const updatedProfiles = data.updatedProfiles;

        setCredits(updatedCredits);
        setProfiles(updatedProfiles);
      } else {
        console.error('Failed to update credits:.');
      }
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const handleRemoveAllCredits = async () => {

    const hasProfileWithCredits = profiles.some((profile) => profile.credits > 0);
    if (!hasProfileWithCredits) {
      console.log('No profiles with credits greater than 0 to perform the operation.');
      return;
    }

    try {
      const response = await fetch(`${serverURL}/business/removeAllCredits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedCredits = data.updatedCredits;
        const updatedProfiles = data.updatedProfiles;

        setCredits(updatedCredits);
        setProfiles(updatedProfiles);
      } else {
        console.error('Failed to update credits');
      }
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBusinessInfo(profileOwner);
        const profilesData = await fetchProfiles(profileOwner);
        setProfiles(profilesData.profiles);
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
          profiles,
          setProfiles,
          selectedProfile,
          setSelectedProfile,
          updateProfile,
          deleteProfile,
          giveProfileCredits,
          removeProfileCredits,
          handleGiveAllCredits,
          handleRemoveAllCredits,
          formattedBillingCycleEnd,
          subscription,
          subscriptionProductId,
          subscriptionCredits,
        }}>
      {children}
    </BusinessContext.Provider>
  );
};
