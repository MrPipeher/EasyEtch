import { View, Text, Button, FlatList, ScrollView} from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTherapistProfileContext } from '../../components/TherapistProfileContext';
import { useServerContext } from '../../components/ServerContext';
import DispositionContainer from '../../components/DispositionContainer';

const dispositions = [
  'Bright', 'Flat', 'Subdued', 'Aggressive', 'Happy', 'Playful',
  'Exhausted', 'Confused', 'Defiant', 'Ecstatic', 'Suspicious', 'Disgusted',
  'Angry', 'Sad', 'Frightened', 'Depressed', 'Bored', 'Talkative',
  'Shy', 'Overwhelmed', 'Lonely', 'Enraged', 'Frustrated', 'Calm'
];

const GenerateTherapistNotesScreen = () => {
  const navigation = useNavigation();
  const { profiles, selectedProfile, setSelectedProfile, note, setNote } = useTherapistProfileContext();
  const { serverURL, profileOwner, credits, setCredits } = useServerContext();
  const [selectedDispositions, setSelectedDispositions] = useState([]);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };
  
  const navigateToPurchase = () => {
    navigation.navigate('Purchase');
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

    if (credits === 0) {
      console.error('Error: Please purchase more credits to continue.');
      return;
    }

    try {
      const response = await fetch(`${serverURL}/therapist/generate?profileOwner=${profileOwner}`, {
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
        setNote(data.generatedText);
        setCredits(data.remainingCredits);
        setSelectedDispositions([]);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending selected profile to server:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId.toString()}
        renderItem={({ item }) => (
          <Button title={item.profileName} onPress={() => handleProfileSelect(item)} disabled={item === selectedProfile} />
        )}
      />
      <DispositionContainer
        dispositions={dispositions}
        selectedDispositions={selectedDispositions}
        toggleDisposition={toggleDisposition}
      />
      <ScrollView>
        {note ? (
          <Text>{note}</Text>
        ) : (
          <Text>No output generated yet.</Text>
        )}
      </ScrollView>
      {selectedProfile && (
        <View>
          <Text>Credits: {credits}</Text>

          <Text>Profile Name: {selectedProfile.profileName}</Text>

          <Text>Profile Gender: {selectedProfile.profileGender}</Text>

          <Text>Profile Goals: {selectedProfile.profileGoals}</Text>

          <Text>Profile Objectives: {selectedProfile.profileObjective}</Text>

          <Text>Profile Intervention: {selectedProfile.profileIntervention}</Text>

          <Button title="Generate!" onPress={handleGenerate} />
          <Button title="Purchase!" onPress={navigateToPurchase} />
        </View>
      )}
    </View>
  );
}

export default GenerateTherapistNotesScreen