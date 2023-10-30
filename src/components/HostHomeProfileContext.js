import React, { createContext, useContext, useEffect, useState } from 'react';
import { useServerURL } from './ServerURLContext';

const HostHomeProfileContext = createContext();

export const useHostHomeProfileContext = () => {
  return useContext(HostHomeProfileContext);
};

export const HostHomeProfileProvider = ({ children, profileOwner }) => {
  const serverURL = useServerURL();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [note, setNote] = useState(null);
  const [dayProgram, setDayProgram] = useState(false);

  const fetchProfiles = async (profileOwner) => {
    try {
      const response = await fetch(`${serverURL}/hostHome/profiles?profileOwner=${profileOwner}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  };

  const createProfile = async (newProfileData) => {
    try {
      const response = await fetch(`${serverURL}/hostHome/createprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileOwner,
          ...newProfileData,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Profile created successfully:', data);
        setProfiles([...profiles, data]);
        setSelectedProfile(data);
      } else {
        console.error('Error creating profile:', data.error);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      const response = await fetch(`${serverURL}/hostHome/updateprofile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          profileId: updatedProfile.profileId,
          updatedProfileData: updatedProfile
        })
      });

      if (response.ok) {
        console.log('Profile updated successfully!');
        const updatedProfiles = profiles.map(profile =>
          profile.profileId === updatedProfile.profileId ? updatedProfile : profile
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
      const response = await fetch(`${serverURL}/hostHome/deleteprofile`, {
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
          setSelectedProfile(updatedProfiles.length > 0 ? updatedProfiles[0] : null);
        }
      } else {
        console.error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profilesData = await fetchProfiles(profileOwner);
        setProfiles(profilesData);
        if (profilesData.length > 0) {
          setSelectedProfile(profilesData[0]);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchData();
  }, [profileOwner]);

  return (
    <HostHomeProfileContext.Provider 
      value={{ 
          profileOwner,
          profiles,
          createProfile,
          updateProfile,
          deleteProfile,
          selectedProfile,
          setSelectedProfile,
          note,
          setNote,
          dayProgram,
          setDayProgram,
        }}>
      {children}
    </HostHomeProfileContext.Provider>
  );
};
