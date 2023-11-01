import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { CustomActionButton, CustomInputField } from '../../components/UIComponents/UIComponents';
import { LinearGradient } from 'expo-linear-gradient';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid email or password.');
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
          <View className = "h-[10%]"/>

          {/* Header */}
          <View className = "h-[40%] justify-center items-center">

            {/* Logo */}
            <Image 
              className = "w-[60%] h-[100%] absolute"
              source={require('../../../assets/images/Logo.png')} 
            />

          </View>

          {/* Container */}
          <View className = "h-[30%] justify-center items-center">

            {error && (
              <Text className = "text-red-500 text-base m-2">{error}</Text>
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

            <CustomActionButton onPress={handleSignIn} buttonText="Sign In"/>

          </View>

          {/* Footer */}
          <View className = "h-[20%] justify-center items-center space-y-5">

            <TouchableOpacity onPress={navigateToForgotPassword}>
              <Text className = "text-white text-base">Forgot password?</Text>
            </TouchableOpacity>

              <TouchableOpacity  onPress={navigateToSignUp}>
                <Text className = "text-white text-base">Don't have an account? Sign up</Text>
              </TouchableOpacity>

          </View>

        </LinearGradient>
      </View>
    </View>
  );
};

export default SignInScreen;
