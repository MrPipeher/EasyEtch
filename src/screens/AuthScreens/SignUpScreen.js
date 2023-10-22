import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';
import { CustomInputField, CustomActionButton, CustomButton } from '../../components/UIComponents/UIComponents';
import { LinearGradient } from 'expo-linear-gradient';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Host Home'); // Default value is 'Host Home'
  const serverURL = useServerURL();

  const handleSignup = async () => {
    try {
      const response = await fetch(`${serverURL}/common/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      if (response) {
        navigateToWelcome();
      } else {
        console.error('Error signing up on server:', errorData.error);
      }
    } catch (error) {
      console.error('Error signing up:', error);
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
              className = "object-contain h-48 w-96"
              source={require('../../../assets/images/Logo.png')} 
            />

          </View>

          {/* Picker */}
          <View className = "h-[20%] justify-center items-center">

            <View className = "w-full items-center justify-center">

              <Text className = "text-white text-base text-center">Account Type:</Text>

              <View className = "w-[50%] border-2 border-sky-500 bg-white">
                <Picker
                  selectedValue={userType}
                  onValueChange={(itemValue) => setUserType(itemValue)}
                >
                  <Picker.Item label="Host Home" value="Host Home" />
                  <Picker.Item label="Therapist" value="Therapist" />
                </Picker>
              </View>
              
            </View>

          </View>

          {/* Container */}
          <View className = "h-[30%] justify-center items-center">

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

            <TouchableOpacity onPress={navigateToSignIn}>
              <Text className = "text-white text-base">Go Back</Text>
            </TouchableOpacity>

          </View>

        </LinearGradient>
      </View>
    </View>
  );
};

export default SignUpScreen;
