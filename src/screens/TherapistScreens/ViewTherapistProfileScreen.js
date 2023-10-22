import React from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useTherapistProfileContext } from '../../components/TherapistProfileContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const ViewTherapistProfileScreen = () => {
  const { profiles, selectedProfile, setSelectedProfile, updateProfile, deleteProfile } = useTherapistProfileContext();
  const navigation = useNavigation();

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

          <View className = "h-[30%] justify-center">

          <Text className = "text-center text-white">Select a Profile:</Text>

            <View className = "flex-row h-[20%] justify-center space-x-2">
              <View className = "w-[60%] h-full border-2 border-sky-500 bg-white self-center justify-center">
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
                  <Text className = "text-black text-base text-center">+</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {selectedProfile && (
          <View className = "h-[70%]">

            {/* Profile Info */}
            <View className = "h-[50%] justify-center items-center space-y-2">

              <View className = "w-[75%] h-[15%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full w-full text-black text-base text-center"
                  placeholder="Profile Name"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileName}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileName: text })}
                  secureTextEntry={false}
                />
              </View>

              <View className = "w-[75%] h-[15%] bg-white rounded-full justify-center">
                  <TouchableOpacity onPress={handleGenderToggle}> 
                    <Text className = "text-black text-base text-center">Gender: {selectedProfile.profileGender}</Text>
                  </TouchableOpacity>
              </View>

              <View className = "w-[75%] h-[15%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full w-full text-black text-base text-center"
                  placeholder="Profile Goals"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileGoals}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileGoals: text })}
                />
              </View>

              <View className = "w-[75%] h-[15%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full w-full text-black text-base text-center"
                  placeholder="Profile Objective"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileObjective}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileObjective: text })}
                />
              </View>

              <View className = "w-[75%] h-[15%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full text-black text-base text-center"
                  placeholder="Profile Intervention"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileIntervention}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileIntervention: text })}
                />
              </View>

            </View>

            {/* Footer */}

            <View className = "flex-row h-[50%] justify-evenly items-center">

              <View className = "w-[40%] h-[30%] bg-white/20 border-2 border-white rounded-full justify-center items-center">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={handleUpdateProfile}>
                  <Text className = "text-white text-xl text-center">Update</Text>
                </TouchableOpacity>
              </View>

              <View className = "w-[40%] h-[30%] bg-white border-2 border-white rounded-full justify-center items-center">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={handleDeleteProfile}>
                  <Text className = "text-black text-xl text-center">Delete</Text>
                </TouchableOpacity>
              </View>

              </View>

          </View>)}
        </LinearGradient>
      </View>
    </View>
  );
}

export default ViewTherapistProfileScreen