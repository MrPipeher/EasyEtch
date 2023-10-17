import React, {useState} from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useProfileContext } from '../../components/ProfileContext';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';

const GenerateScreen = () => {
  const { profiles, selectedProfile, setSelectedProfile, profileOwner, credits, setCredits} = useProfileContext();
  const navigation = useNavigation();
  const [output, setOutput] = useState(null);
  const serverURL = useServerURL();

  const handleSignOut = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch(`${serverURL}/generate?profileOwner=${profileOwner}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProfile),
      });
  
      const data = await response.json();
  
      if (data) {
        console.log(`Generated Prompt: `, data.generatedText);
        setOutput(String(data.generatedText));
        setCredits(data.remainingCredits)
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending selected profile to server:', error);
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const navigateToPurchase = () => {
    navigation.navigate('Purchase');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId}
        renderItem={({ item }) => (
          <Button
            title={item.profileName}
            onPress={() => handleProfileSelect(item)}
            disabled={item === selectedProfile}
          />
        )}
      />
      {output && <Text>Output is: {output}</Text>}
      {selectedProfile && (
        <View>
          <Button title="Generate!" onPress={handleGenerate} />
          <Text>Credits: {credits}</Text>
          <Button title="Purchase!" onPress={navigateToPurchase} />
          <Text>Profile Gender: {selectedProfile.profileGender}</Text>
          <Text>Profile Goals: {selectedProfile.profileGoals}</Text>
          <Text>Profile Intervention: {selectedProfile.profileIntervention}</Text>
          <Text>Profile Objective: {selectedProfile.profileObjective}</Text>
          <Text>Profile Name: {selectedProfile.profileName}</Text>
        </View>
      )}
      <Text>Top of the morning!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default GenerateScreen;
