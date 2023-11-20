import { View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTherapistProfileContext } from '../../components/TherapistProfileContext';
import { useServerContext } from '../../components/ServerContext';
import DispositionContainer from '../../components/DispositionContainer';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import * as Clipboard from 'expo-clipboard';

const behaviorDispositions = [
  'Aggressive', 'Angry', 'Bored', 'Bright', 'Calm', 'Confused',
  'Defiant', 'Depressed', 'Disgusted', 'Ecstatic', 'Enraged', 'Exhausted',
  'Flat', 'Frightened', 'Frustrated', 'Happy', 'Lonely', 'Overwhelmed',
  'Playful', 'Sad', 'Shy', 'Subdued', 'Suspicious', 'Talkative'
];

const interventionDispositions = [
  'ADHD', 'Anger', 'Anxiety', 'Communication Skills', 'Conduct disorder', 'Depression', 'Drug use', 'Emotional Spirals',
  'Externalizing Behaviors', 'Family Conflicts', 'Grief/Loss Unresolved', 'Identifying Activating Events', 'Impulsivity', 'Internalizing Behaviors ',
  'Low Self-Esteem ', 'Oppositional Defiant Disorder', 'Parenting', 'Positive Qualities Record', 'PTSD', 'Relationship Issues', 'Self Compassion', 'Self-Defeating Behavior',
  'Self-Mutilation', 'Stress', 'Truancy',
];

const GenerateTherapistNotesScreen = () => {
  const navigation = useNavigation();
  const { profiles, selectedProfile, setSelectedProfile, 
    note, 
    setNote, 
    behavior,
    setBehavior,
    intervention,
    setIntervention,
    response,
    setResponse,
    plan,
    setPlan 
  } = useTherapistProfileContext();
  const { serverURL, profileOwner, credits, setCredits } = useServerContext();
  const [selectedBehaviorDispositions, setSelectedBehaviorDispositions] = useState('');
  const [selectedInterventionDispositions, setSelectedInterventionDispositions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };
  
  const navigateToPurchase = () => {
    navigation.navigate('Purchase');
  };

  const toggleBehaviorDisposition = (disposition) => {
    setSelectedBehaviorDispositions(disposition);
  };
  
  const toggleInterventionDisposition = (disposition) => {
    setSelectedInterventionDispositions(disposition);
  };
  
  const handleGenerate = async () => {
    if (selectedBehaviorDispositions.length === 0 || selectedInterventionDispositions.length === 0) {
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
          selectedBehaviorDispositions,
          selectedInterventionDispositions
        }),
      });

      const data = await response.json();

      if (data) {
        setNote(true);
        setBehavior(data.behavior);
        setIntervention(data.intervention);
        setResponse(data.response)
        setPlan(data.plan)
        setCredits(data.remainingCredits);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending selected profile to server:', error);
    }

    setLoading(false);
  };

  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Saved!', 'item has been saved');
  }

  const getCurrentDate = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
  };

  const handleSave = async () => {
    try {
      const formattedDate = getCurrentDate();
      const filename = `${formattedDate}.txt`;
      const combinedText = `Behavior\n\n${behavior}\n\nIntervention\n\n${intervention}\n\nResponse\n\n${response}\n\nPlan\n\n${plan}`;

      // Create a Blob containing the text
      const blob = new Blob([combinedText], { type: 'text/plain' });

      // Create a download link and trigger a click event to download the file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.error('Error saving file:', error);
      // Handle error as needed
    }
  };

  const handleFinished = () => {
    setSelectedBehaviorDispositions('');
    setSelectedInterventionDispositions('');
    setNote(false);
    setBehavior('');
    setIntervention('');
    setResponse('');
    setPlan('');
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
                  <View className = "w-full h-full justify-center items-center my-2 space-y-4">

                    <View className = "flex-row space-x-8 justify-center">

                      <Text className = "text-black text-xl text-center font-bold underline">Behavior</Text>

                      <View className = "w-[50%] h-[100%] bg-white border-2 border-black rounded-full">
                        <TouchableOpacity className="w-full h-full justify-center" onPress={() => handleCopy(behavior)}>
                          <Text className = "text-black text-base text-center">Copy</Text>
                        </TouchableOpacity>
                      </View>

                    </View>

                    <Text className = "text-black text-xl text-center">{behavior}</Text>

                    <View className = "flex-row space-x-8 justify-center">

                      <Text className = "text-black text-xl text-center font-bold underline">Intervention</Text>

                      <View className = "w-[50%] h-[100%] bg-white border-2 border-black rounded-full">
                        <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handleCopy(intervention)}>
                          <Text className = "text-black text-base text-center">Copy</Text>
                        </TouchableOpacity>
                      </View>

                    </View>

                    <Text className = "text-black text-xl text-center">{intervention}</Text>

                    <View className = "flex-row space-x-8 justify-center">

                      <Text className = "text-black text-xl text-center font-bold underline">Response</Text>

                      <View className = "w-[50%] h-[100%] bg-white border-2 border-black rounded-full">
                        <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handleCopy(response)}>
                          <Text className = "text-black text-base text-center">Copy</Text>
                        </TouchableOpacity>
                      </View>

                    </View>

                    <Text className = "text-black text-xl text-center">{response}</Text>

                    <View className = "flex-row space-x-8 justify-center">

                      <Text className = "text-black text-xl text-center font-bold underline">Plan</Text>

                      <View className = "w-[50%] h-[100%] bg-white border-2 border-black rounded-full">
                        <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handleCopy(plan)}>
                          <Text className = "text-black text-base text-center">Copy</Text>
                        </TouchableOpacity>
                      </View>

                    </View>

                    <Text className = "text-black text-xl text-center">{plan}</Text>

                  </View>
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
                    <Text className = "text-black text-xl text-center">New</Text>
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

          <View className = "h-[100%]">

            <View className = "h-[5%]"/>

            <Text className = "text-white text-xl text-center">Behavior</Text>

            <View className = "h-[25%] w-[50%] space-y-1 self-center">

              <DispositionContainer
                dispositions={behaviorDispositions}
                selectedDisposition={selectedBehaviorDispositions}
                toggleDisposition={toggleBehaviorDisposition}
              />

            </View>

            <View className = "h-[5%]"/>

            <Text className = "text-white text-xl text-center">Intervention</Text>

            <View className = "h-[25%] w-[50%] space-y-1 self-center">

              <DispositionContainer
                dispositions={interventionDispositions}
                selectedDisposition={selectedInterventionDispositions}
                toggleDisposition={toggleInterventionDisposition}
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

          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

export default GenerateTherapistNotesScreen