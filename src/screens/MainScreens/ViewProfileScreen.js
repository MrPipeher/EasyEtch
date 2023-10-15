import React from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useProfileContext } from '../../components/ProfileContext';

const ViewProfileScreen = () => {
  const { profiles, selectedProfile, updateProfile, deleteProfile, setSelectedProfile } = useProfileContext();

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(selectedProfile);
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile(selectedProfile.profileId);
      console.log('Profile deleted successfully!');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId.toString()} // Assuming profileId is a number
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
