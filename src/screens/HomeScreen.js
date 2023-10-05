import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
        const auth = FIREBASE_AUTH;
        await signOut(auth); // Call the signOut function from Firebase authentication
        // Sign-out successful, navigate to another screen or perform any other action
        navigation.navigate('Welcome'); // Navigate to the welcome screen after signing out
    } catch (error) {
        console.error('Error signing out:', error);
        // Handle error, show error message to the user, etc.
    }
  };
  return (
    <View>
      <Text>Top of the morning!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  )
}

export default HomeScreen