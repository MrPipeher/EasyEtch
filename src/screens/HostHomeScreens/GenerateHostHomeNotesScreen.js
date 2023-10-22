import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useHostHomeProfileContext } from '../../components/HostHomeProfileContext';
import { useServerContext } from '../../components/ServerContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

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
              <Text className = "text-white text-center text-base">{selectedProfile.profileGoals}</Text>
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
                
              {/* <Text className = "text-center">Credits: {credits}</Text>
              <ScrollView>
                {note ? (
                  <Text>{note}</Text>
                ) : (
                  <Text>No output generated yet.</Text>
                )}
              </ScrollView> */}
            </View>
            
            {/* Footer */}
            <View className = "h-[30%] justify-center items-center">
                
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