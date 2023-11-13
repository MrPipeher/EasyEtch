import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTherapistProfileContext } from '../../components/TherapistProfileContext';
import { useServerContext } from '../../components/ServerContext';
import DispositionContainer from '../../components/DispositionContainer';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

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
  const [loading, setLoading] = useState(false);

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

    //Start Loading
    setLoading(true);

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

    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Note Saved!', 'Your note has been saved to your clipboard!')
  };

  const handleSave = async () => {
    await copyToClipboard(note);
  };

  const handleFinished = () => {
    setNote('');
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

              <Text className = "text-white text-base text-center">We accept 07</Text>

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
  
            <View className = "h-[10%]"/>

            <View className = "h-[60%]">

              <View className = "h-[80%] w-[80%] bg-white justify-center self-center p-4">

                <ScrollView>
                  <Text className = "text-black text-base text-center">{note}</Text>
                </ScrollView>

              </View>

            </View>

            <View className = "h-[30%] items-center">
                
              <View className = "flex-row w-full h-[50%] justify-evenly">
                <View className = "w-[40%] h-[50%] bg-green-500 rounded-full items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleSave}>
                    <Text className = "text-white text-xl text-center">Save</Text>
                  </TouchableOpacity>
                </View>

                <View className = "w-[40%] h-[50%] bg-white border-2 border-green-500 rounded-full items-center">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleGenerate}>
                    <Text className = "text-black text-xl text-center">Retry</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className = "h-[50%] w-full justify-center items-center">
                <View className = "w-[40%] h-[50%] bg-white border-2 border-white rounded-full">
                  <TouchableOpacity className = "w-full h-full justify-center" onPress={handleFinished}>
                    <Text className = "text-black text-xl text-center">Go Back</Text>
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

            <View className = "h-[10%] space-y-1"/>

            <View className = "h-[30%] w-[85%] space-y-1p-4 self-center">

              <ScrollView>
                <Text className = "text-white text-xl font-bold text-center">Profile Goals:</Text>
                <Text className = "text-white text-center text-base text-transform: capitalize">{selectedProfile.profileGoals}</Text>

                <Text className = "text-white text-xl font-bold text-center">Profile Objective:</Text>
                <Text className = "text-white text-center text-base text-transform: capitalize">{selectedProfile.profileObjective}</Text>

                <Text className = "text-white text-xl font-bold text-center">Profile Intervention:</Text>
                <Text className = "text-white text-center text-base text-transform: capitalize">{selectedProfile.profileIntervention}</Text>
              </ScrollView>

            </View>

            <View className = "h-[30%] w-[85%] space-y-1 self-center">

              <DispositionContainer
                dispositions={dispositions}
                selectedDispositions={selectedDispositions}
                toggleDisposition={toggleDisposition}
              />

            </View>
            
            {/* Footer */}
            <View className = "h-[30%]">
                
              <View className = "h-full w-full justify-center items-center space-y-3">

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

export default GenerateTherapistNotesScreen