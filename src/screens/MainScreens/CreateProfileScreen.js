import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import { useProfileContext } from '../../components/ProfileContext';

const CreateProfileScreen = () => {
  const { createProfile } = useProfileContext();
  const [profileName, setProfileName] = useState('');
  const [profileGender, setProfileGender] = useState('male');
  const [profileObjective, setProfileObjective] = useState('');
  const [profileIntervention, setProfileIntervention] = useState('');
  const [profileGoals, setProfileGoals] = useState('');

  const handleProfileCreation = async () => {
    if (
      !profileName.trim() ||
      !profileGender.trim() ||
      !profileObjective.trim() ||
      !profileIntervention.trim() ||
      !profileGoals.trim()
    ) {
      console.error('All fields are required.');
      return;
    }
  
    const newProfileData = {
      profileName,
      profileGender,
      profileObjective,
      profileIntervention,
      profileGoals,
    };
  
    try {
      await createProfile(newProfileData);

      //Reset Fields
      setProfileName('');
      setProfileGender('male');
      setProfileObjective('');
      setProfileIntervention('');
      setProfileGoals('');
  
    } catch (error) {
      console.log('Error creating profile:', error.message);
    }
  };  

  const handleGenderToggle = () => {
    setProfileGender(prevGender => (prevGender === 'male' ? 'female' : 'male'));
  };

  return (
    <View>
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
      <Button title="Create" onPress={handleProfileCreation}></Button>
    </View>
  );
};

export default CreateProfileScreen;
