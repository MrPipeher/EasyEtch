import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';
import { CustomInputField, CustomActionButton } from '../../components/UIComponents/UIComponents';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Host Home'); // Default value is 'Host Home'
  const serverURL = useServerURL();
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    try {
      const response = await fetch(`${serverURL}/common/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      if (response.ok) {
        handleSignIn();
      } else {
        if (response.status == 500) {
          setError('This Email is already Registed, try using forgot password!');
        } else {
          setError('Error connecting to server.');
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Error connecting to server.');
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

          {/* Title */}
          <View className = "h-[5%]"/>

          {/* Header */}
          <View className = "h-[25%] justify-center items-center">

            {/* Logo */}
            <Image 
              className = "w-[60%] h-[100%] absolute"
              source={require('../../../assets/images/Logo.png')} 
            />

          </View>

          {/* Picker */}
          <View className = "h-[20%] justify-center items-center">

            <View className = "w-full h-full items-center justify-center">

              <Text className = "text-white text-2xl text-center">Account Type:</Text>

              <View className = "flex-row h-full w-full justify-center items-center space-x-8">

                {userType === 'Host Home' ? (
                  <View className = "w-[30%] h-[50%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Therapist')}>
                      <Text className = "text-white text-xl text-center">Host Home</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[50%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Host Home')}>
                      <Text className = "text-white text-xl text-center">Host Home</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {userType === 'Therapist' ? (
                  <View className = "w-[30%] h-[50%] border-2 border-green-500 bg-green-500 rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Host Home')}>
                      <Text className = "text-white text-xl text-center">Therapist</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className = "w-[30%] h-[50%] border-2 border-white rounded-full justify-center items-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Therapist')}>
                      <Text className = "text-white text-xl text-center">Therapist</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
            </View>

          </View>

          {/* Container */}
          <View className = "h-[30%] justify-center items-center">

            {error && (
              <Text className = "text-red-500 text-xl text-center m-2">{error}</Text>
            )}

            <CustomInputField
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              secureTextEntry={false}
            />

            <CustomInputField
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
            />

            <CustomActionButton onPress={handleSignup} buttonText="Sign Up"/>

          </View>

          {/* Footer */}
          <View className = "h-[20%] justify-center items-center">

            <View className = "w-[40%] h-[30%] bg-white border-2 border-sky-500 rounded-full justify-center items-center">
              <TouchableOpacity className = "w-full h-full justify-center" onPress={navigateToSignIn}>
                <Text className = "text-black text-xl text-center">Go Back</Text>
              </TouchableOpacity>
            </View>

          </View>

        </LinearGradient>
      </View>
    </View>
  );
};

export default SignUpScreen;
