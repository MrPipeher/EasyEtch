import { View, Text, Button, FlatList, ScrollView} from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useHostHomeProfileContext } from '../../components/HostHomeProfileContext';
import { useServerContext } from '../../components/ServerContext';

const GenerateHostHomeNotesScreen = () => {
  const navigation = useNavigation();
  const { profiles, selectedProfile, setSelectedProfile, note, setNote } = useHostHomeProfileContext();
  const { serverURL, profileOwner, credits, setCredits } = useServerContext();
  const [dayProgram, setDayProgram] = useState(false);


  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleToggleDayProgram = () => {
    setDayProgram(!dayProgram); // Toggle dayProgram value
  };
  
  const navigateToPurchase = () => {
    navigation.navigate('Purchase');
  };

  const handleGenerate = async () => {

    if (credits === 0) {
      console.error('Error: Please purchase more credits to continue.');
      return;
    }
    
    try {
      const response = await fetch(`${serverURL}/hostHome/generate?profileOwner=${profileOwner}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedProfile,
          dayProgram,
        }),
      });

      const data = await response.json();

      if (data) {
        setNote(data.generatedText);
        setCredits(data.remainingCredits);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending selected profile to server:', error);
    }
  };

  return (
    <View style={{}}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId.toString()}
        renderItem={({ item }) => (
          <Button title={item.profileName} onPress={() => handleProfileSelect(item)} disabled={item === selectedProfile} />
        )}
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

          <Text>Morning Medication: {selectedProfile.morningMedication ? 'Yes' : 'No'}</Text>

          <Text>Afternoon Medication: {selectedProfile.afternoonMedication ? 'Yes' : 'No'}</Text>

          <Text>Night Medication: {selectedProfile.nightMedication ? 'Yes' : 'No'}</Text>

          <Text>Activities:</Text>
          <FlatList
            data={selectedProfile.activities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>{item}</Text>}
          />
          <Button title={`Day Program: ${dayProgram ? 'Yes' : 'No'}`} onPress={handleToggleDayProgram} />
          <Button title="Purchase!" onPress={navigateToPurchase} />
          <Button title="Generate!" onPress={handleGenerate} />
        </View>
      )}
    </View>
  );
}

export default GenerateHostHomeNotesScreen