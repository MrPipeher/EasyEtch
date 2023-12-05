import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { useBusinessContext } from '../../components/BusinessContext';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';

const DeleteProfileModal = ({ isVisible, onCancel, onDelete }) => {
  return (
    <Modal isVisible={isVisible} transparent={false}>
      <View className = "h-[75%] w-[75%] bg-white justify-center items-center self-center space-y-8">

        <Text className = "text-black text-center text-base">Are you sure you want to delete your profile? This action cannot be undone.</Text>

        <View className = "h-[20%] w-[40%] border-2 border-black rounded-2xl justify-center">
          <TouchableOpacity className = "h-full w-full justify-center" onPress={onCancel}>
            <Text className = "text-black text-center text-base">Cancel</Text>
          </TouchableOpacity>
        </View>

        <View className = "h-[20%] w-[40%] border-2 bg-red-500 border-black rounded-2xl justify-center">
          <TouchableOpacity className = "h-full w-full justify-center" onPress={onDelete}>
            <Text className = "text-white text-center text-base">Delete</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
};

const ViewBusiness = () => {
  const { profiles, 
    selectedProfile, 
    setSelectedProfile, 
    updateProfile, 
    deleteProfile, 
    businessName, 
    currentUsers, 
    userAmount, 
    credits, 
    giveProfileCredits,
    removeProfileCredits,
    handleGiveAllCredits,
    handleRemoveAllCredits,
  } = useBusinessContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState(profiles);
  const dataToRender = search ? filteredProfiles : profiles;
  const [showCredits, setShowCredits] = useState(false);

  const handleSignOut = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleDeleteProfile = async () => {
    setModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(selectedProfile);
      console.log('Profile updated successfully:', selectedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProfile(selectedProfile.email);
    } catch (error) {
      console.error('Error deleting profile:', error);
    }

    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearch(text);

    const filtered = profiles.filter((profile) => {
      const fullName = `${profile.firstName} ${profile.lastName}`;
      return fullName.toLowerCase().includes(text.toLowerCase()) || profile.email.toLowerCase().includes(text.toLowerCase());
    });

    setFilteredProfiles(filtered);
  };

  const handleProfessionToggle = async () => {
    setSelectedProfile(prevProfile => ({
      ...prevProfile,
      profession: prevProfile.profession === 'Host Home' ? 'Therapist' : 'Host Home',
    }));
  };  

  const handleCreditChange = (newCreditValue) => {
    const maxCreditsAllowed = Math.max(selectedProfile.credits, credits);
    const finalCreditValue = Math.min(newCreditValue, maxCreditsAllowed);
    setCreditAmount(finalCreditValue);
  };
  
  const handleGiveCredits = async () => {
    try {
      await giveProfileCredits(selectedProfile, creditAmount);
      setCreditAmount(0);
    } catch (error) {
      console.error('Error giving credits:', error);
    }
  };

  const handleRemoveCredits = async () => {
    try {
      await removeProfileCredits(selectedProfile, creditAmount);
      setCreditAmount(0);
    } catch (error) {
      console.error('Error removing credits:', error);
    }
  };

  const handleCreditsToggle = () => {
    setShowCredits(prevShowCredits => !prevShowCredits);
  }; 

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "h-[5%]"/>

          {/* Header */}
          <View className = "h-[10%] flex-row mx-4 justify-center items-center">
            <View className = "bg-white border border-black w-[40%]">
              <Text className = "text-center text-black font-bold text-xl">{businessName}</Text>
              <Text className = "text-center text-black font-bold text-xl">Users: {currentUsers} / {userAmount}</Text>
            </View>

            <View className = "absolute right-0 w-[25%] max-w-[100] bg-white border border-black rounded-full">
              <TouchableOpacity onPress={handleSignOut}> 
                <Text className = "text-black text-base text-center">Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Business Info */}
          <View className = "h-[10%] bg-white w-[75%] self-center border border-black">

            <Text className = "text-center text-black text-xl">Credits: {credits}</Text>

            <View className = "flex-row h-[50%] w-full justify-evenly items-center">

              <View className = "w-[30%] h-[75%] bg-green-500 border-2 border-black rounded-full">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={handleGiveAllCredits}>
                  <Text className = "text-white text-xl text-center">Split</Text>
                </TouchableOpacity>
              </View>

              <View className = "w-[30%] h-[75%] bg-red-500 border-2 border-black rounded-full">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={handleRemoveAllCredits}>
                  <Text className = "text-white text-xl text-center">Remove</Text>
                </TouchableOpacity>
              </View>

            </View>
          
          </View>

          {/* Select Profile Container */}
          <View className = "h-[20%] space-y-2">
            <Text className = "text-center text-white font-bold text-xl">Select a Profile:</Text>

            <TextInput
              className = "text-center text-black bg-white w-[75%] self-center border border-black"
              placeholder="Search profiles"
              onChangeText={handleSearch}
              value={search}
            />

            <View className = "h-[50%] w-[75%] self-center border border-black">
              <ScrollView>
                {dataToRender.map((item, index) => (
                  <View key={index} className = "h-[35] w-full bg-white border border-black justify-center self-center px-2">
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleProfileSelect(item)}
                    >
                      <Text key={index} className = "text-base text-black">{item.firstName}, {item.lastName} ({item.credits})</Text>
                    </TouchableOpacity> 
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {selectedProfile && (
          <View className = "h-[55%]">

            <DeleteProfileModal
              isVisible={isModalVisible}
              onCancel={handleCancel}
              onDelete={handleConfirmDelete}
            />

            {/* Basic Info*/}
            <View className = "h-[30%] w-[75%] self-center justify-center bg-white border border-black">

              <Text className = "text-black text-base mx-2">Name: {selectedProfile.firstName} {selectedProfile.lastName}</Text>
              <Text className = "text-black text-base mx-2">Email: {selectedProfile.email}</Text>
              <TouchableOpacity onPress={handleProfessionToggle}> 
                <Text className = "text-black text-base mx-2">Profession: {selectedProfile.profession}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreditsToggle}> 
                <Text className = "text-black text-base mx-2">Credits: {selectedProfile.credits}</Text>
              </TouchableOpacity>
              <Text className = "text-black text-base mx-2">Total Notes: {selectedProfile.totalNotes}</Text>

            </View>

            {/* Credits */}
            {showCredits && (
            <View className = "h-[30%] w-[75%] self-center bg-white justify-center items-center border border-black">
              <Text className = "text-black text-xl text-center">Credits:</Text>

              <View className = "w-[75%] h-[20%] bg-white rounded-full justify-center border border-black">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Amount"
                  placeholderTextColor={'gray'}
                  value={creditAmount.toString()}
                  onChangeText={(text) => handleCreditChange(parseInt(text, 10))}
                  secureTextEntry={false}
                />
              </View>

              <View className = "flex-row justify-evenly w-full h-[60%]">
                <View className="w-[30%] h-[40%] bg-green-500 border-2 border-black rounded-full justify-center items-center self-center">
                  <TouchableOpacity className="w-full h-full justify-center" onPress={handleGiveCredits}>
                    <Text className="text-white text-xl text-center">Add</Text>
                  </TouchableOpacity>
                </View>

                <View className="w-[30%] h-[40%] bg-red-500 border-2 border-black rounded-full justify-center items-center self-center">
                  <TouchableOpacity className="w-full h-full justify-center" onPress={handleRemoveCredits}>
                    <Text className="text-white text-xl text-center">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            )}
            
            {/* Footer */}
            <View className = "h-[30%] w-[75%] self-center justify-center space-y-4">
              <View className = "flex-row h-[50%] justify-evenly items-center">

                <View className = "w-[40%] h-[75%] bg-sky-500 border-2 border-white rounded-full justify-center items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleUpdateProfile}>
                    <Text className = "text-white text-xl text-center">Update</Text>
                  </TouchableOpacity>
                </View>

                <View className = "w-[40%] h-[75%] bg-red-500 border-2 border-white rounded-full justify-center items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleDeleteProfile}>
                    <Text className = "text-white text-xl text-center">Delete</Text>
                  </TouchableOpacity>
                </View>
                
              </View>

              <View className = "w-[40%] h-[30%] bg-white border-2 border-white rounded-full justify-center items-center self-center">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setSelectedProfile(null)}>
                  <Text className = "text-black text-xl text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
            
          </View>)}
        </LinearGradient>
      </View>
    </View>
  );
};

export default ViewBusiness;