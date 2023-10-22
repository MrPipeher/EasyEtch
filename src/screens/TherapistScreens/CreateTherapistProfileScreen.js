import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, FlatList, ScrollView } from 'react-native';
import { useTherapistProfileContext } from '../../components/TherapistProfileContext';
import { LinearGradient } from 'expo-linear-gradient';

const CreateTherapistProfileScreen = () => {
  const { createProfile } = useTherapistProfileContext();
  const [profileName, setProfileName] = useState('');
  const [profileGender, setProfileGender] = useState('Male');
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
      setProfileGender('Male');
      setProfileObjective('');
      setProfileIntervention('');
      setProfileGoals('');
  
    } catch (error) {
      console.log('Error creating profile:', error.message);
    }
  };  

  const handleGenderToggle = () => {
    setProfileGender(prevGender => (prevGender === 'Male' ? 'Female' : 'Male'));
  };

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>
            
            {/* Title */}
            <View className = "h-[30%]"/>

            {/* Profile Info */}
            <View className = "h-[40%] justify-center items-center my-2">
        
              <View className = "w-[75%] h-[10%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Name"
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => setProfileName(text)}
                  value={profileName}
                  secureTextEntry={false}
                />
              </View>

              <View className = "w-[75%] h-[10%] bg-white rounded-full justify-center my-2">
                  <TouchableOpacity onPress={handleGenderToggle}>
                    <Text className = "text-black text-base text-center">Gender: {profileGender}</Text>
                  </TouchableOpacity>
              </View>

              <View className = "w-[75%] h-[10%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Goals"
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => setProfileGoals(text)}
                  value={profileGoals}
                  secureTextEntry={false}
                />
              </View>

              <View className = "w-[75%] h-[10%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Objective"
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => setProfileObjective(text)}
                  value={profileObjective}
                  secureTextEntry={false}
                />
              </View>

              <View className = "w-[75%] h-[10%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Intervention"
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => setProfileIntervention(text)}
                  value={profileIntervention}
                  secureTextEntry={false}
                />
              </View>

            </View>

            {/* Footer */}
            <View className = "h-[30%] items-center justify-center">
              <View className = " h-[25%] w-[50%] bg-white rounded-full justify-center my-2">
                <TouchableOpacity onPress={handleProfileCreation}>
                  <Text className = "text-black text-base text-center">Create</Text>
                </TouchableOpacity>
              </View>
            </View>
        </LinearGradient>
      </View>
    </View>
  );
}

export default CreateTherapistProfileScreen