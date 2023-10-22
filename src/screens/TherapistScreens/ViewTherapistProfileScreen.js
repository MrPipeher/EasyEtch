import React from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useTherapistProfileContext } from '../../components/TherapistProfileContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

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
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "h-[30%] justify-center">

          <Text className = "text-center text-white">Select a Profile:</Text>

            <View className = "w-[50%] border-2 border-sky-500 bg-white self-center">
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

          </View>

          {selectedProfile && (
          <View className = "h-[70%]">

            {/* Profile Info */}
            <View className = "h-[50%] justify-center items-center my-4">

              <Text className = "text-white">Profile Name</Text>

              <View className = "w-[75%] h-[20%] bg-white rounded-full justify-center my-2">
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

              <View className = "w-[75%] h-[20%] bg-white rounded-full justify-center my-2">
                  <TouchableOpacity onPress={handleGenderToggle}> 
                    <Text className = "text-black text-base text-center">Gender: {selectedProfile.profileGender}</Text>
                  </TouchableOpacity>
              </View>

              <Text className = "text-white">Profile Goals</Text>

              <View className = "w-[75%] h-[20%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Goals"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileGoals}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileGoals: text })}
                />
              </View>

              <Text className = "text-white">Profile Objective</Text>

              <View className = "w-[75%] h-[20%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Profile Objective"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileObjective}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileObjective: text })}
                />
              </View>

              <Text className = "text-white">Profile Intervention</Text>

              <View className = "w-[75%] h-[20%] bg-white rounded-full justify-center my-2">
                <TextInput
                  className=" text-black text-base text-center"
                  placeholder="Profile Intervention"
                  placeholderTextColor={'gray'}
                  value={selectedProfile.profileIntervention}
                  onChangeText={(text) => setSelectedProfile({ ...selectedProfile, profileIntervention: text })}
                />
              </View>

            </View>

            {/* Footer */}
            <View className = "h-[50%] items-center justify-center">
              <View className = " h-[25%] w-[50%] bg-white rounded-full justify-center my-2">
                <TouchableOpacity onPress={handleUpdateProfile}>
                  <Text className = "text-black text-base text-center">Update</Text>
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