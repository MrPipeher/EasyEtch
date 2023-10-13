import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

const fetchProfiles = async (profileOwner) => {
  try {
    const response = await fetch(`http://10.0.0.70:5000/profiles?profileOwner=${profileOwner}`);
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

const ViewProfileScreen = ({ route }) => {
  const { profileOwner } = route.params;
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    if (profileOwner) {
      // Fetch profiles when the component mounts or when the profile owner changes
      const fetchProfilesData = async () => {
        try {
          const profilesData = await fetchProfiles(profileOwner);
          setProfiles(profilesData);
          // Select the first profile by default
          if (profilesData.length > 0) {
            setSelectedProfile(profilesData[0]);
          }
        } catch (error) {
          console.error('Error fetching profiles:', error);
          // Handle error
        }
      };

      fetchProfilesData();
    } else {
      console.log('no profile owner');
    }
  }, [profileOwner]); // Run this effect whenever profileOwner changes

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('http://192.168.1.134:5000/updateprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          profileId: selectedProfile.profileId,
          updatedProfileData: selectedProfile
        })
      });

      if (response.ok) {
        console.log('Profile updated successfully!');
        // Handle success, e.g., show a success message to the user
      } else {
        console.error('Failed to update profile');
        // Handle error, e.g., show an error message to the user
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch('http://192.168.1.134:5000/deleteprofile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileOwner: profileOwner,
          profileId: selectedProfile.profileId
        })
      });

      if (response.ok) {
        console.log('Profile deleted successfully!');
        const updatedProfiles = profiles.filter(profile => profile.profileId !== selectedProfile.profileId);
        setProfiles(updatedProfiles);

        // Select the first profile by default if any profiles are left
        if (updatedProfiles.length > 0) {
          setSelectedProfile(updatedProfiles[0]);
        } else {
          setSelectedProfile(null);
        }
      } else {
        console.error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId}
        renderItem={({ item }) => (
          <Button
            title={item.profileName}
            onPress={() => handleProfileSelect(item)}
            disabled={item === selectedProfile}
          />
        )}
      />
      {selectedProfile && (
        <View>
            <Button title="Delete Profile" onPress={handleDeleteProfile} />
          <Text>Profile Gender:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            value={selectedProfile.profileGender}
            onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileGender: text })}
          />

          <Text>Profile Goals:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            value={selectedProfile.profileGoals}
            onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileGoals: text })}
          />

          <Text>Profile Intervention:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            value={selectedProfile.profileIntervention}
            onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileIntervention: text })}
          />

          <Text>Profile Objective:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            value={selectedProfile.profileObjective}
            onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileObjective: text })}
          />

          <Text>Profile Name:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            value={selectedProfile.profileName}
            onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileName: text })}
          />

          <Button title="Submit" onPress={handleUpdateProfile} />
        </View>
      )}
    </View>
  );
};

export default ViewProfileScreen;
