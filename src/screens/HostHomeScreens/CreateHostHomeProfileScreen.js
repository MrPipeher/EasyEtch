import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useHostHomeProfileContext } from '../../components/HostHomeProfileContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const CreateHostHomeProfileScreen = () => {
  const { createProfile } = useHostHomeProfileContext();
  const [profileName, setProfileName] = useState('');
  const [profileGender, setProfileGender] = useState('Male');
  const [profileGoals, setProfileGoals] = useState('');
  const [morningMedication, setMorningMedication] = useState(false);
  const [afternoonMedication, setAfternoonMedication] = useState(false);
  const [nightMedication, setNightMedication] = useState(false);
  const [activity, setActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const navigation = useNavigation();

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
      setProfileGender('Male');
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
    setProfileGender(prevGender => (prevGender === 'Male' ? 'Female' : 'Male'));
  };

  const navigateToView = () => {
    navigation.navigate('ViewProfile');
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
            <View className = "h-[10%]"/>

            {/* Profile Info */}
            <View className = "h-[20%] justify-center items-center">
        
              <View className = "w-[75%] h-[25%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Name"
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => setProfileName(text)}
                  value={profileName}
                  secureTextEntry={false}
                />
              </View>

              <View className = "w-[75%] h-[25%] bg-white rounded-full justify-center my-2">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={handleGenderToggle}>
                  <Text className = "text-black text-base text-center">Gender: {profileGender}</Text>
                </TouchableOpacity>
              </View>

              <View className = "w-[75%] h-[25%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Goals"
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => setProfileGoals(text)}
                  value={profileGoals}
                  secureTextEntry={false}
                />
              </View>

            </View>

            {/* Medication */}
            <View className = "h-[15%] justify-center">

              <Text className = "text-white text-xl text-center">Medication Time:</Text>

              <View className = "flex-row h-[70%] justify-evenly items-center">
                {morningMedication ? (
                  <View className = "w-[30%] h-[75%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setMorningMedication(!morningMedication)}>
                      <Text className = "text-white text-xl text-center">Morning</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[75%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setMorningMedication(!morningMedication)}>
                      <Text className = "text-white text-xl text-center">Morning</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {afternoonMedication ? (
                  <View className = "w-[30%] h-[75%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setAfternoonMedication(!afternoonMedication)}>
                      <Text className = "text-white text-xl text-center">Afternoon</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[75%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setAfternoonMedication(!afternoonMedication)}>
                      <Text className = "text-white text-xl text-center">Afternoon</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {nightMedication  ? (
                  <View className = "w-[30%] h-[75%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setNightMedication(!nightMedication)}>
                      <Text className = "text-white text-xl text-center">Night</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[75%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setNightMedication(!nightMedication)}>
                      <Text className = "text-white text-xl text-center">Night</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Activities */}
            <View className = "h-[40%]">
              <View className = "flex-row h-[20%] justify-evenly items-center my-2">

                <View className = "w-[60%] h-[100%] bg-white rounded-full">
                  <TextInput
                    className="h-full w-full text-black text-base text-center"
                    placeholder="Add Activity"
                    placeholderTextColor={'gray'}
                    onChangeText={(text) => setActivity(text)}
                    value={activity}
                    secureTextEntry={false}
                  />
                </View>
                <View className = "w-[30%] h-[100%] border-2 border-white rounded-full justify-center items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleAddActivity}>
                    <Text className = "text-white text-xl text-center">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className = "h-[70%] bg-white border-2 border-white rounded-2xl py-2 m-4">
                <FlatList
                  data={activities}
                  renderItem={({ item, index }) => (
                    <ScrollView>
                      <View className = "flex-row">

                        <Text className = "w-[75%] text-center text-black">{item}</Text>

                        <View className = "w-[25%]">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handleDeleteActivity(index)}>
                            <Text className = "text-red-500 text-base text-center">X</Text>
                          </TouchableOpacity>
                        </View>

                      </View>
                    </ScrollView>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>

            {/* Footer */}
            <View className = "h-[15%] flex-row items-center justify-evenly">
              <View className = " h-[50%] w-[30%] bg-white/20 border-2 border-white rounded-full justify-center my-2">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={handleProfileCreation}>
                  <Text className = "text-white text-xl text-center">Create</Text>
                </TouchableOpacity>
              </View>

              <View className = " h-[50%] w-[30%] bg-white rounded-full justify-center my-2">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={navigateToView}>
                  <Text className = "text-black text-xl text-center">Go back</Text>
                </TouchableOpacity>
              </View>
            </View>
        </LinearGradient>
      </View>
    </View>
  );
}

export default CreateHostHomeProfileScreen;
