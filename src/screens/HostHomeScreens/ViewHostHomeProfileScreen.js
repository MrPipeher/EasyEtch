import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useHostHomeProfileContext } from '../../components/HostHomeProfileContext';

const ViewHostHomeProfileScreen = () => {
  const { profiles, selectedProfile, setSelectedProfile, updateProfile, deleteProfile } = useHostHomeProfileContext();
  const [newActivity, setNewActivity] = useState('');

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleAddActivity = () => {
    if (newActivity.trim() !== '') {
      setSelectedProfile({ ...selectedProfile, activities: [...selectedProfile.activities, newActivity] });
      setNewActivity('');
    }
  };

  const handleDeleteActivity = (activity) => {
    const updatedActivities = selectedProfile.activities.filter((item) => item !== activity);
    setSelectedProfile({ ...selectedProfile, activities: updatedActivities });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(selectedProfile);
      console.log('Profile updated successfully:', selectedProfile);
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId.toString()}
        renderItem={({ item }) => (
          <Button title={item.profileName} onPress={() => handleProfileSelect(item)} disabled={item === selectedProfile} />
        )}
      />
      {selectedProfile && (
        <View>
          <Button title="Delete Profile" onPress={handleDeleteProfile} />

          <Text>Profile Gender:</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button
              title="Male"
              onPress={() => setSelectedProfile({ ...selectedProfile, profileGender: 'Male' })}
              disabled={selectedProfile?.profileGender === 'Male'}
            />
            <Button
              title="Female"
              onPress={() => setSelectedProfile({ ...selectedProfile, profileGender: 'Female' })}
              disabled={selectedProfile?.profileGender === 'Female'}
            />
          </View>

          <Text>Profile Goals:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            value={selectedProfile.profileGoals}
            onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileGoals: text })}
          />

          <Text>Profile Name:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            value={selectedProfile.profileName}
            onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileName: text })}
          />

          <Text>Morning Medication:</Text>
          <Button
            title={selectedProfile.morningMedication ? 'Yes' : 'No'}
            onPress={() => setSelectedProfile({ ...selectedProfile, morningMedication: !selectedProfile.morningMedication })}
          />

          <Text>Afternoon Medication:</Text>
          <Button
            title={selectedProfile.afternoonMedication ? 'Yes' : 'No'}
            onPress={() => setSelectedProfile({ ...selectedProfile, afternoonMedication: !selectedProfile.afternoonMedication })}
          />

          <Text>Night Medication:</Text>
          <Button
            title={selectedProfile.nightMedication ? 'Yes' : 'No'}
            onPress={() => setSelectedProfile({ ...selectedProfile, nightMedication: !selectedProfile.nightMedication })}
          />

          <Text>Activities:</Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, flex: 1, marginRight: 10 }}
              value={newActivity}
              onChangeText={(text) => setNewActivity(text)}
            />
            <Button title="Add" onPress={handleAddActivity} />
          </View>
          <FlatList
            data={selectedProfile.activities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{item}</Text>
                <TouchableOpacity onPress={() => handleDeleteActivity(item)}>
                  <Text style={{ color: 'red', marginLeft: 10 }}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Button title="Submit" onPress={handleUpdateProfile} />
        </View>
      )}
    </View>
  );
}

export default ViewHostHomeProfileScreen;
