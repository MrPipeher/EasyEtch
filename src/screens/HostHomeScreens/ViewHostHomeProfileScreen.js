import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useHostHomeProfileContext } from '../../components/HostHomeProfileContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const ViewHostHomeProfileScreen = () => {
  const { profiles, selectedProfile, setSelectedProfile, updateProfile, deleteProfile } = useHostHomeProfileContext();
  const [newActivity, setNewActivity] = useState('');
  const navigation = useNavigation();

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

  const handleGenderToggle = () => {
    setSelectedProfile(prevProfile => ({
      ...prevProfile,
      profileGender: prevProfile.profileGender === 'Male' ? 'Female' : 'Male',
    }));
  };  

  const navigateToCreate = () => {
    navigation.navigate('CreateProfile');
  };

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "h-[15%]">

            <View className = "absolute inset-x-0 bottom-0">
              <Text className = "text-center text-white">Select a Profile:</Text>

              <View className = "flex-row justify-center space-x-2">
                <View className = "w-[60%] h-full border-2 border-sky-500 bg-white self-center ">
                  <Picker
                    selectedValue={selectedProfile ? selectedProfile.profileId.toString() : ''}
                    onValueChange={(itemValue) => handleProfileSelect(profiles.find(item => item.profileId.toString() === itemValue))}
                  >
                    {profiles.map((item) => (
                      <Picker.Item
                        key={item.profileId.toString()}
                        label={item.profileName}
                        value={item.profileId.toString()}
                      />
                    ))}
                  </Picker>
                </View>

                <View className = "w-[20%] h-[100%] bg-white border-2 border-green-500 rounded-full justify-center">
                  <TouchableOpacity onPress={navigateToCreate}> 
                    <Text className = "text-black text-base text-center">Add New</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>

          {selectedProfile && (
          <View className = "h-[85%]">

            {/* Basic Info*/}
            <View className = "h-[30%] justify-center items-center space-y-1">

              <Text className = "text-white">Profile Name</Text>

              <View className = "w-[75%] h-[18%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Name"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileName}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileName: text })}
                  secureTextEntry={false}
                />
              </View>

              <Text className = "text-white">Profile Gender</Text>

              <View className = "w-[75%] h-[18%] bg-white rounded-full justify-center">
                <TouchableOpacity onPress={handleGenderToggle}> 
                  <Text className = "text-black text-base text-center">Gender: {selectedProfile.profileGender}</Text>
                </TouchableOpacity>
              </View>

              <Text className = "text-white">Profile Goals</Text>

              <View className = "w-[75%] h-[18%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Goals"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileGoals}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileGoals: text })}
                  secureTextEntry={false}
                />
              </View>

            </View>

            {/* Medications */}
            
            <View className = "h-[20%]">
              <Text className = "text-white text-xl text-center">Medications:</Text>

              <View className = "flex-row h-[70%] justify-evenly items-center">
                {selectedProfile.morningMedication ? (
                  <View className = "w-[30%] h-[75%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setSelectedProfile({ ...selectedProfile, morningMedication: !selectedProfile.morningMedication })}>
                      <Text className = "text-white text-xl text-center">Morning</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[75%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setSelectedProfile({ ...selectedProfile, morningMedication: !selectedProfile.morningMedication })}>
                      <Text className = "text-white text-xl text-center">Morning</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedProfile.afternoonMedication ? (
                  <View className = "w-[30%] h-[75%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setSelectedProfile({ ...selectedProfile, afternoonMedication: !selectedProfile.afternoonMedication })}>
                      <Text className = "text-white text-xl text-center">Afternoon</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[75%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setSelectedProfile({ ...selectedProfile, afternoonMedication: !selectedProfile.afternoonMedication })}>
                      <Text className = "text-white text-xl text-center">Afternoon</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {selectedProfile.nightMedication ? (
                  <View className = "w-[30%] h-[75%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setSelectedProfile({ ...selectedProfile, nightMedication: !selectedProfile.nightMedication })}>
                      <Text className = "text-white text-xl text-center">Night</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[75%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setSelectedProfile({ ...selectedProfile, nightMedication: !selectedProfile.nightMedication })}>
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
                    onChangeText={(text) => setNewActivity(text)}
                    value={newActivity}
                    secureTextEntry={false}
                  />
                </View>
                <View className = "w-[30%] h-[100%] border-2 border-white rounded-full justify-center items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleAddActivity}>
                    <Text className = "text-white text-xl text-center">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className = "h-[60%] bg-white border-2 border-white rounded-2xl py-2 m-4">
                <FlatList
                  data={selectedProfile.activities}
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
            <View className = "h-[10%]">
              <View className = "flex-row h-[70%] justify-evenly items-center">

                <View className = "w-[30%] h-[75%] bg-white/20 border-2 border-white rounded-full justify-center items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleUpdateProfile}>
                    <Text className = "text-white text-xl text-center">Update</Text>
                  </TouchableOpacity>
                </View>

                <View className = "w-[30%] h-[75%] bg-red-500 border-2 border-red-500 rounded-full justify-center items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleDeleteProfile}>
                    <Text className = "text-white text-xl text-center">Delete</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            </View>

          </View>)}
        </LinearGradient>
      </View>
    </View>
  );
}

export default ViewHostHomeProfileScreen;