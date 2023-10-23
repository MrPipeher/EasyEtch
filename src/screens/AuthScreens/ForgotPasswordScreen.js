import React, {useState} from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { CustomInputField } from '../../components/UIComponents/UIComponents';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (error) {
      // Handle errors
      console.error('Error sending password reset email:', error.message);
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "h-full w-full justify-center items-center space-y-4">

            <View className = "h-[20%]"/>

            <View className = "h-[50%] w-full justify-center items-center space-y-4">

              <View className = "w-[75%] h-[15%] bg-white rounded-full justify-center">
                <TextInput
                  className="h-full w-full text-black text-base text-center self-center"
                  placeholder="Enter your Email"
                  placeholderTextColor={'gray'}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View className = "w-[50%] h-[10%] bg-sky-400/50 border-2 border-white rounded-full justify-center">
                <TouchableOpacity className = "h-full w-full justify-center" onPress={handlePasswordReset}> 
                  <Text className = "text-white text-xl text-center">Send Email</Text>
                </TouchableOpacity>
              </View>

              {emailSent ? <Text className = "text-center text-white text-2xl">Please check your email for instructions on resetting your password.</Text> : null}
            </View>

            <View className = "h-[30%] w-full items-center">

              <View className = "w-[25%] h-[20%] bg-white rounded-full justify-center">
                <TouchableOpacity className = "h-full w-full justify-center" onPress={navigateToSignIn}> 
                  <Text className = "text-black text-xl text-center">Go Back</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
