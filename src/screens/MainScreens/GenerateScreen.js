import React, {useState} from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useProfileContext } from '../../components/ProfileContext';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';
import DispositionContainer from '../../components/DispositionContainer';

const dispositions = [
  'Bright', 'Flat', 'Subdued', 'Aggressive', 'Happy', 'Playful',
  'Exhausted', 'Confused', 'Defiant', 'Ecstatic', 'Suspicious', 'Disgusted',
  'Angry', 'Sad', 'Frightened', 'Depressed', 'Bored', 'Talkative',
  'Shy', 'Overwhelmed', 'Lonely', 'Enraged', 'Frustrated', 'Calm'
];

const GenerateScreen = () => {
  const serverURL = useServerURL();
  const { profiles, selectedProfile, setSelectedProfile, profileOwner, credits, setCredits} = useProfileContext();
  const navigation = useNavigation();
  const [output, setOutput] = useState(null);
  const [selectedDispositions, setSelectedDispositions] = useState([]);

  const handleSignOut = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleDisposition = (disposition) => {
    const updatedDispositions = selectedDispositions.includes(disposition)
      ? selectedDispositions.filter((item) => item !== disposition)
      : [...selectedDispositions, disposition];

    setSelectedDispositions(updatedDispositions);
  };

  const handleGenerate = async () => {
    
    if (selectedDispositions.length === 0) {
      console.error('Error: Please select at least one disposition.');
      return;
    }

    try {
      const response = await fetch(`${serverURL}/generate?profileOwner=${profileOwner}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedProfile,
          selectedDispositions,
        }),
      });
  
      const data = await response.json();
  
      if (data) {
        setOutput(String(data.generatedText));
        setCredits(data.remainingCredits)
        setSelectedDispositions([]);
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
      {/* List of client dispositions */}
      <DispositionContainer
        dispositions={dispositions}
        selectedDispositions={selectedDispositions}
        toggleDisposition={toggleDisposition}
      />
      <ScrollView>
        {output ? (
          <Text>{output}</Text>
        ) : (
          <Text>No output generated yet.</Text>
        )}
      </ScrollView>
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

const styles = StyleSheet.create({
  dispositionButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#eaeaea',
    alignItems: 'center',
  },
  selectedDispositionButton: {
    backgroundColor: 'lightblue', // You can customize the color for selected dispositions
  },
});

export default GenerateScreen;
