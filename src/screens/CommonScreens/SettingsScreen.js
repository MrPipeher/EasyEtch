import React from 'react';
import { View, Text, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { useServerContext } from '../../components/ServerContext';

const SettingsScreen = () => {
  const { accountType, changeAccountType, profileOwner } = useServerContext();

  const handleAccountTypeChange = (newAccountType) => {
    changeAccountType(profileOwner, newAccountType);
  };

  const handleSignOut = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current Account Type: {accountType}</Text>
      <Button title="Change to Host Home" onPress={() => handleAccountTypeChange('Host Home')} />
      <Button title="Change to Therapist" onPress={() => handleAccountTypeChange('Therapist')} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default SettingsScreen;
