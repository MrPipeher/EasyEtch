import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Host Home');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const serverURL = useServerURL();
  const [error, setError] = useState(null);
  const [canSignIn, setCanSignIn] = useState(false);

  const handleSignup = async () => {
    setCanSignIn(false);

    try {
      const response = await fetch(`${serverURL}/common/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      if (response.ok) {

        await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        setError('An email verification has been sent to your email address.');
        await sendEmailVerification(FIREBASE_AUTH.currentUser);

        setCanSignIn(true);

      } else {
        if (response.status == 500) {
          setError('This Email already exists. If you just verified the address, click "go back" and sign in.');
        } else {
          setError('Error connecting to server.');
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const navigateToSignIn = async () => {
    if (canSignIn) {
      await signOut(FIREBASE_AUTH);
      setCanSignIn(false);      
      navigation.navigate('SignIn');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
          <View className = "h-[25%] w-full justify-center items-center">

            {/* Logo */}
            <Image 
              className = "w-[30%] h-[70%] absolute"
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

            <View className="w-[50%] h-[30%] border-white border-2 bg-sky-400/50 rounded-xl justify-center my-2">
                <TouchableOpacity onPress={handleSignup}>
                    <Text className="text-white text-xl text-center">Sign Up</Text>
                </TouchableOpacity>
            </View>

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
