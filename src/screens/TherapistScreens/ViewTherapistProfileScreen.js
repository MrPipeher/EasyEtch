import React from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useTherapistProfileContext } from '../../components/TherapistProfileContext';

const ViewTherapistProfileScreen = () => {
  const { profiles, selectedProfile, setSelectedProfile, updateProfile, deleteProfile } = useTherapistProfileContext();

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = { ...selectedProfile};
      await updateProfile(updatedProfile);
      console.log(updatedProfile)
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile(selectedProfile.profileId);
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleGenderToggle = () => {
    setSelectedProfile(prevProfile => ({
      ...prevProfile,
      profileGender: prevProfile.profileGender === 'Male' ? 'Female' : 'Male',
    }));
  };  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId.toString()}
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

          <TouchableOpacity onPress={handleGenderToggle}>
            <Text>Profile Gender: {selectedProfile.profileGender}</Text>
          </TouchableOpacity>

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
}

export default ViewTherapistProfileScreen