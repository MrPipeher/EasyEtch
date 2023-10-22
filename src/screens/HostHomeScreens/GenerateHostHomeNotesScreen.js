import { View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useHostHomeProfileContext } from '../../components/HostHomeProfileContext';
import { useServerContext } from '../../components/ServerContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import * as Clipboard from 'expo-clipboard';

const GenerateHostHomeNotesScreen = () => {
  const navigation = useNavigation();
  const { profiles, selectedProfile, setSelectedProfile, note, setNote } = useHostHomeProfileContext();
  const { serverURL, profileOwner, credits, setCredits } = useServerContext();
  const [dayProgram, setDayProgram] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleToggleDayProgram = () => {
    setDayProgram(!dayProgram); // Toggle dayProgram value
  };
  
  const navigateToPurchase = () => {
    navigation.navigate('Purchase');
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Note Saved!', 'Your note has been saved to your clipboard!')
  };

  const handleSave = async () => {
    await copyToClipboard(note);
    setNote('');
  };

  const handleGenerate = async () => {

    if (credits === 0) {
      console.error('Error: Please purchase more credits to continue.');
      return;
    }

    if (note) {
      setNote('');
    }

    //Start Loading
    setLoading(true);
    
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

    setLoading(false);
  };

  if (loading) {
    return (
      <View className = "bg-white flex-1">
  
        {/* Main Container */}
        <View className = "h-[100%] w-[100%] max-w-[1080] self-center">
  
          {/* Background Gradient */}
          <LinearGradient 
            className = "h-full w-full absolute" 
            colors={['#88daf7', '#66c4ff', '#008bff']}>
  
            <View className = "h-[20%]"/>

            <View className = "h-[60%] justify-center">

              <Text className = "text-white text-3xl text-center">Generating Note..</Text>

            </View>

            <View className = "h-[20%] justify-center items-center">

            </View>
          
          </LinearGradient>
        </View>
      </View>
    );
  }

  if (note) {
    return (
      <View className = "bg-white flex-1">
  
        {/* Main Container */}
        <View className = "h-[100%] w-[100%] max-w-[1080] self-center">
  
          {/* Background Gradient */}
          <LinearGradient 
            className = "h-full w-full absolute" 
            colors={['#88daf7', '#66c4ff', '#008bff']}>
  
            <View className = "h-[20%]"/>

            <View className = "h-[60%]">

              <View className = "h-[80%] w-[80%] bg-white justify-center self-center p-4">

                <ScrollView>
                  <Text className = "text-black text-base text-center">{note}</Text>
                </ScrollView>

              </View>

            </View>

            <View className = "h-[20%] justify-center items-center">
                
              <View className = "flex-row w-full h-full justify-evenly">

                <View className = "w-[40%] h-[30%] bg-green-500 rounded-full items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleSave}>
                    <Text className = "text-white text-xl text-center">Save</Text>
                  </TouchableOpacity>
                </View>

                <View className = "w-[40%] h-[30%] bg-white border-2 border-white rounded-full items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleGenerate}>
                    <Text className = "text-black text-xl text-center">Retry</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "h-[20%] justify-center pt-14">

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
          <View className = "h-[80%]">

            <View className = "h-[15%] space-y-1">
              <Text className = "text-white text-xl font-bold text-center">Profile Goals:</Text>
              <View className = "h-[50%] w-[75%] bg-white justify-center self-center rounded-full">
                <Text className = "text-black text-center text-base">{selectedProfile.profileGoals}</Text>
              </View>
            </View>

            {/* Basic Info*/}
            <View className = "h-[15%] space-y-1">

            <Text className = "text-white text-xl font-bold text-center">Medications:</Text>

              <View className = " bg-white m-4 p-2 justify-center rounded-2xl">
                <Text className = "text-black">-Morning: {selectedProfile.morningMedication ? 'Yes' : 'No'} </Text>
                <Text className = "text-black">-Afternoon: {selectedProfile.afternoonMedication ? 'Yes' : 'No'} </Text>
                <Text className = "text-black">-Night: {selectedProfile.nightMedication ? 'Yes' : 'No'} </Text>
              </View>
                
            </View>

            {/* Activities */}
            <View className = "h-[40%] space-y-1 pt-6">

              <Text className = "text-white text-xl font-bold text-center">Activities:</Text>

              <View className = "h-[40%] m-4 p-2 bg-white rounded-2xl">
                <ScrollView>
                  {selectedProfile.activities.map((item, index) => (
                    <Text key={index} className = "text-black text-transform: capitalize">
                      -{item}
                    </Text>
                  ))}
                </ScrollView>
              </View>

              <View className = "w-[50%] h-[15%] bg-white border-2 border-white rounded-full self-center items-center">
                <TouchableOpacity className = "w-full h-full justify-center" onPress={handleToggleDayProgram}>
                  <Text className = "text-black text-xl text-center">Day Program: {dayProgram ? 'Yes' : 'No'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Footer */}
            <View className = "h-[30%]">
                
              <View className = "h-full w-full items-center space-y-3">

                <Text className = "text-white font-bold text-xl">Credits: {credits}</Text>

                <View className = "w-[50%] h-[40%] bg-white border-2 border-white rounded-full justify-center items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleGenerate}>
                    <Text className = "text-black text-xl text-center">Generate!</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={navigateToPurchase}>
                  <Text className = "text-white font-bold text-xl">Buy Credits?</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>)}
        </LinearGradient>
      </View>
    </View>
  );
}

export default GenerateHostHomeNotesScreen