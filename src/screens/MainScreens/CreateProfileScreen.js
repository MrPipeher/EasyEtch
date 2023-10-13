import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateProfileScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { profileOwner } = params;

  const [profileName, setProfileName] = useState('');
  const [profileGender, setProfileGender] = useState('male'); // Default value is male
  const [profileObjective, setProfileObjective] = useState('');
  const [profileIntervention, setProfileIntervention] = useState('');
  const [profileGoals, setProfileGoals] = useState('');

  const handleGenderToggle = () => {
    setProfileGender(prevGender => (prevGender === 'male' ? 'female' : 'male'));
  };

  const handleProfileCreation = async () => {
    try {
      const response = await fetch('http://192.168.1.134:5000/createprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileOwner,
          profileName,
          profileGender,
          profileObjective,
          profileIntervention,
          profileGoals,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Profile created successfully, handle the response if needed
        console.log('Profile created successfully:', data);
      } else {
        // Handle error response from the server
        console.error('Error creating profile:', data.error);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <View>
      <Text>Profile Owner: {profileOwner}</Text>
      <TextInput
        placeholder="Profile Name"
        value={profileName}
        onChangeText={text => setProfileName(text)}
      />
      <TouchableOpacity onPress={handleGenderToggle}>
        <Text>Gender: {profileGender}</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Profile Objective"
        value={profileObjective}
        onChangeText={text => setProfileObjective(text)}
      />
      <TextInput
        placeholder="Profile Intervention"
        value={profileIntervention}
        onChangeText={text => setProfileIntervention(text)}
      />
      <TextInput
        placeholder="Profile Goals"
        value={profileGoals}
        onChangeText={text => setProfileGoals(text)}
      />
      <Button title="Create Profile" onPress={handleProfileCreation} />
    </View>
  );
};

export default CreateProfileScreen;
