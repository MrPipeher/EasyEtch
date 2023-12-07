import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      const auth = FIREBASE_AUTH;
      const credentials = await signInWithEmailAndPassword(auth, email, password);

      if (!credentials.user.emailVerified) {
        setError('Please verify your email before logging in.');
        await signOut(FIREBASE_AUTH);
      }

    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid email or password.');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const openYoutubeVideo = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://youtu.be/33VtnTBJcHw');
    } catch (error) {
      console.error(error);
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

          {/* Header */}
          <View className = "h-[30%] justify-center items-center">

            {/* Logo */}
            <Image 
              className = "w-[60%] h-[100%] absolute"
              source={require('../../../assets/images/Logo.png')} 
            />

          </View>

          {/* Container */}
          <View className = "h-[55%] w-full justify-center items-center">

            {error && (
              <Text className = "text-red-500 text-base m-2">{error}</Text>
            )}

            <View className = "w-[75%] h-[20%] bg-white/75 rounded-full justify-center my-2">
              <TextInput
                  className="h-full w-full text-black text-xl text-center self-center"
                  placeholder="Email"
                  placeholderTextColor={'gray'}
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  secureTextEntry={false}
              />
            </View>

            <View className = "w-[75%] h-[20%] bg-white/75 rounded-full justify-center my-2">
                <TextInput
                    className="h-full w-full text-black text-xl text-center self-center"
                    placeholder="Password"
                    placeholderTextColor={'gray'}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={!isPasswordVisible}
                />

                <TouchableOpacity
                  style={{ position: 'absolute', right: 20, top: '50%', transform: [{ translateY: -12.5 }] }}
                  onPress={togglePasswordVisibility}
                >
                  <Image
                    source={require('../../../assets/password.png')}
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity>

            </View>
            

            <View className="w-[50%] h-[15%] border-white border-2 bg-sky-400/50 rounded-xl justify-center my-2">
              <TouchableOpacity onPress={handleSignIn}>
                  <Text className="text-white text-xl text-center">Sign In</Text>
              </TouchableOpacity>
            </View>

            <View className="w-[50%] h-[15%] border-sky-500 border-2 bg-white rounded-xl justify-center my-2">
                <TouchableOpacity onPress={navigateToSignUp}>
                    <Text className="text-sky-500 text-xl text-center">Sign Up</Text>
                </TouchableOpacity>
            </View>

          </View>

          {/* Footer */}
          <View className = "h-[15%] justify-evenly items-center">

            <TouchableOpacity onPress={navigateToForgotPassword}>
              <Text className = "text-white text-2xl">Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openYoutubeVideo}>
              <Text className = "text-white text-2xl">Need help?</Text>
            </TouchableOpacity>

          </View>

        </LinearGradient>
      </View>
    </View>
  );
};

export default SignInScreen;
