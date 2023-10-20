import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, FlatList } from 'react-native';
import { useHostHomeProfileContext } from '../../components/HostHomeProfileContext';

const CreateHostHomeProfileScreen = () => {
  const { createProfile } = useHostHomeProfileContext();
  const [profileName, setProfileName] = useState('');
  const [profileGender, setProfileGender] = useState('male');
  const [profileGoals, setProfileGoals] = useState('');
  const [morningMedication, setMorningMedication] = useState(false);
  const [afternoonMedication, setAfternoonMedication] = useState(false);
  const [nightMedication, setNightMedication] = useState(false);
  const [activity, setActivity] = useState('');
  const [activities, setActivities] = useState([]);

  const handleProfileCreation = async () => {
    if (!profileName.trim() || !profileGender.trim() || !profileGoals.trim()) {
      console.error('All fields are required.');
      return;
    }

    const newProfileData = {
      profileName,
      profileGender,
      profileGoals,
      morningMedication,
      afternoonMedication,
      nightMedication,
      activities,
    };

    try {
      await createProfile(newProfileData);

      // Reset Fields
      setProfileName('');
      setProfileGender('male');
      setProfileGoals('');
      setMorningMedication(false);
      setAfternoonMedication(false);
      setNightMedication(false);
      setActivities([]);

    } catch (error) {
      console.log('Error creating profile:', error.message);
    }
  };

  const handleAddActivity = () => {
    if (activity.trim()) {
      setActivities(prevActivities => [...prevActivities, activity]);
      setActivity('');
    }
  };

  const handleDeleteActivity = (index) => {
    setActivities(prevActivities => prevActivities.filter((_, i) => i !== index));
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
        placeholder="Profile Goals"
        value={profileGoals}
        onChangeText={text => setProfileGoals(text)}
      />
      <View>
        <Text>Medications:</Text>
        <TouchableOpacity onPress={() => setMorningMedication(!morningMedication)}>
          <Text>Morning: {morningMedication ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAfternoonMedication(!afternoonMedication)}>
          <Text>Afternoon: {afternoonMedication ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setNightMedication(!nightMedication)}>
          <Text>Night: {nightMedication ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          placeholder="Add Activity"
          value={activity}
          onChangeText={text => setActivity(text)}
        />
        <Button title="Add Activity" onPress={handleAddActivity} />
        <FlatList
          data={activities}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{item}</Text>
              <TouchableOpacity onPress={() => handleDeleteActivity(index)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Button title="Create" onPress={handleProfileCreation}></Button>
    </View>
  );
}

export default CreateHostHomeProfileScreen;
