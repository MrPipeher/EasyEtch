import React, {useState} from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { useBusinessContext } from '../../components/BusinessContext';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import DispositionContainer from '../../components/DispositionContainer';

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
  } = useBusinessContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState(profiles);
  const dataToRender = search ? filteredProfiles : profiles;

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

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(selectedProfile);
      console.log('Profile updated successfully:', selectedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    setModalVisible(true);
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

  const handleProfessionToggle = () => {
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

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "h-[20%] space-y-2">

            <View className = "absolute inset-x-0 bottom-0">
              
              <View className = "w-[75%] h-[50%] bg-white rounded-full justify-center self-center">
                <TouchableOpacity onPress={handleSignOut}> 
                  <Text className = "text-black text-base text-center">Sign Out</Text>
                </TouchableOpacity>
              </View>

              <Text className = "text-center text-white">Select a Profile:</Text>

                <View className = "w-[60%] h-full border-2 border-sky-500 bg-white self-center ">
                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
                  placeholder="Search profiles"
                  onChangeText={handleSearch}
                  value={search}
                />
                <FlatList
                  data={dataToRender}
                  keyExtractor={(item) => item.email.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleProfileSelect(item)}
                      style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc',
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.firstName}, {item.lastName} - ({item.email})</Text>
                      <Text style={{ fontSize: 16 }}>Credits: ({item.credits})</Text>
                    </TouchableOpacity>
                  )}
                />
                </View>

            </View>

          </View>

          <Text className = "text-center text-white">Company Name: {businessName}</Text>
          <Text className = "text-center text-white">Current Users: {currentUsers}</Text>
          <Text className = "text-center text-white">Maximum Users: {userAmount}</Text>
          <Text className = "text-center text-white">Total Credits: {credits}</Text>

          {selectedProfile && (
          <View className = "h-[80%]">

            <DeleteProfileModal
              isVisible={isModalVisible}
              onCancel={handleCancel}
              onDelete={handleConfirmDelete}
            />

            {/* Basic Info*/}
            <View className = "h-[30%] justify-center items-center">

              <Text className = "text-white text-base">Name: {selectedProfile.firstName} {selectedProfile.lastName}</Text>
              <Text className = "text-white text-base">Email: {selectedProfile.email}</Text>
              <Text className = "text-white text-base">Profession: {selectedProfile.profession}</Text>
              <Text className = "text-white text-base">Credits: {selectedProfile.credits}</Text>
              <Text className = "text-white text-base">Total Notes: {selectedProfile.totalNotes}</Text>

            </View>

            {/* Medications */}
            
            <View className = "h-[40%] items-center">
              <Text className = "text-white text-xl text-center">Give Credits:</Text>

              <View className = "w-[75%] h-[18%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Amount"
                  placeholderTextColor={'gray'}
                  value={creditAmount.toString()}
                  onChangeText={(text) => handleCreditChange(parseInt(text, 10))}
                  secureTextEntry={false}
                />
              </View>

              <View className = "flex-row justify-evenly w-full h-[20%]">
                <View className="w-[30%] h-[50%] bg-white border-2 border-white rounded-full justify-center items-center self-center">
                  <TouchableOpacity className="w-full h-full justify-center" onPress={handleGiveCredits}>
                    <Text className="text-black text-xl text-center">Give Credits</Text>
                  </TouchableOpacity>
                </View>

                <View className="w-[30%] h-[50%] bg-white border-2 border-white rounded-full justify-center items-center self-center">
                  <TouchableOpacity className="w-full h-full justify-center" onPress={handleRemoveCredits}>
                    <Text className="text-black text-xl text-center">Remove Credits</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text className = "text-white text-base">Profession</Text>

              <View className = "w-[75%] h-[18%] bg-white rounded-full justify-center">
                <TouchableOpacity onPress={handleProfessionToggle}> 
                  <Text className = "text-black text-base text-center">{selectedProfile.profession}</Text>
                </TouchableOpacity>
              </View>
                
            </View>
            
            {/* Footer */}
            <View className = "h-[10%] space-y-8">
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

              <View className = "w-[30%] h-[50%] bg-white border-2 border-white rounded-full justify-center items-center self-center">
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