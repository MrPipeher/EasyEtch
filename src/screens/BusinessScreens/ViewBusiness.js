import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';

const ViewBusiness = () => {

  const handleSignOut = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <View>
      <Text>This is a blank screen</Text>
      <View className = "w-[75%] h-[50%] bg-white rounded-full justify-center">
        <TouchableOpacity onPress={handleSignOut}> 
          <Text className = "text-black text-base text-center">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewBusiness;