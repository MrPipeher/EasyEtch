import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const serverURL = useServerURL();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [canSignIn, setCanSignIn] = useState(false);

  const [businessType, setBusinessType] = useState('Individual');
  const [userType, setUserType] = useState('Host Home');
  const [workForBusiness, setWorkForBusiness] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [userAmount, setUserAmount] = useState('');
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigateToSignIn = async () => {
    if (canSignIn) {
      await signOut(FIREBASE_AUTH);
      setCanSignIn(false);      
      navigation.navigate('SignIn');
    } else {
      navigation.navigate('SignIn');
    }
  };

  const handleSignup = async () => {
    setCanSignIn(false);

    if (email === '' || password === '') {setError('Must a username and password'); return;}
    if (workForBusiness && businessName === '') {setError('Must include a business name!'); return;}

    try {
      let response;

      if (businessType === 'Individual') {

        response = await fetch(`${serverURL}/user/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, userType, businessName }),
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
            setError(error.message);
          }
        }

      } else {

        response = await fetch(`${serverURL}/business/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, businessName, userAmount }),
        });

        if (response.ok) {
          const signUpResult = await response.json();

          if (signUpResult.success) {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            setError('An email verification has been sent to your email address.');
            await sendEmailVerification(FIREBASE_AUTH.currentUser);
            setCanSignIn(true);
          } else {
            setError(signUpResult.message);
          }
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "flex-1"
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <ScrollView >
            <View style = {{height: hp('100%')}}>
              <View className = "h-full w-[75%] self-center">

                {/* Header */}
                <View className = "h-[10%]"/>

                {/* Account Type */}
                <View className = "h-[10%] w-full items-center">

                  <Text className = "text-white text-lg">Account Type:</Text>

                  <View className = "flex-row h-full w-full justify-evenly">
                    {businessType === 'Individual' ? (
                      <View className = "w-[40%] h-[40%] border-2 border-green-500 bg-green-500 rounded-full">
                        <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setBusinessType('Individual')}>
                          <Text className = "text-white text-xl text-center">Individual</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className = "w-[40%] h-[40%] border-2 border-white rounded-full">
                        <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setBusinessType('Individual')}>
                          <Text className = "text-white text-xl text-center">Individual</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {businessType === 'Business' ? (
                      <View className = "w-[40%] h-[40%] border-2 border-green-500 bg-green-500 rounded-full">
                        <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setBusinessType('Business')}>
                          <Text className = "text-white text-xl text-center">Business</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className = "w-[40%] h-[40%] border-2 border-white rounded-full">
                        <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setBusinessType('Business')}>
                          <Text className = "text-white text-xl text-center">Business</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>

                {businessType === 'Individual' ? (<>

                  {/* Profession */}
                  <View className = "h-[10%] w-full items-center">

                    <Text className = "text-white text-lg">Profession:</Text>

                    <View className = "flex-row h-full w-full justify-evenly">
                      {userType === 'Host Home' ? (
                        <View className = "w-[40%] h-[40%] border-2 border-green-500 bg-green-500 rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Therapist')}>
                            <Text className = "text-white text-xl text-center">Host Home</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className = "w-[40%] h-[40%] border-2 border-white rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Host Home')}>
                            <Text className = "text-white text-xl text-center">Host Home</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {userType === 'Therapist' ? (
                        <View className = "w-[40%] h-[40%] border-2 border-green-500 bg-green-500 rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Host Home')}>
                            <Text className = "text-white text-xl text-center">Therapist</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className = "w-[40%] h-[40%] border-2 border-white rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setUserType('Therapist')}>
                            <Text className = "text-white text-xl text-center">Therapist</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View> 

                  {/* Business */}
                  <View className = "h-[10%] w-full items-center">

                    <Text className = "text-white text-lg">Do you work for a business?</Text>

                    <View className = "flex-row h-full w-full justify-evenly">
                      {workForBusiness === true ? (
                        <View className = "w-[40%] h-[40%] border-2 border-green-500 bg-green-500 rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setWorkForBusiness(true)}>
                            <Text className = "text-white text-xl text-center">Yes</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className = "w-[40%] h-[40%] border-2 border-white rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setWorkForBusiness(true)}>
                            <Text className = "text-white text-xl text-center">Yes</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {workForBusiness === false ? (
                        <View className = "w-[40%] h-[40%] border-2 border-green-500 bg-green-500 rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setWorkForBusiness(false)}>
                            <Text className = "text-white text-xl text-center">No</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className = "w-[40%] h-[40%] border-2 border-white rounded-full">
                          <TouchableOpacity className = "w-full h-full justify-center" onPress={() => setWorkForBusiness(false)}>
                            <Text className = "text-white text-xl text-center">No</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View> 
                  
                  {/* Error Messages */}
                  <View className = "h-[10%] w-full items-center">
                    {error && (
                      <Text className = "text-red-500 text-base text-center m-2">{error}</Text>
                    )}
                  </View>
                  
                  {/* Input Fields */}
                  <View className = "h-[30%] w-full items-center space-y-1">

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

                    {workForBusiness === true && (
                      <View className = "w-[75%] h-[20%] bg-white/75 rounded-full justify-center my-2">
                        <TextInput
                          className="h-full w-full text-black text-xl text-center self-center"
                          placeholder="Business Name"
                          placeholderTextColor={'gray'}
                          onChangeText={(text) => setBusinessName(text)}
                          value={businessName}
                          secureTextEntry={false}
                        />
                      </View>
                    )}
                  </View>
                </>) : (<>

                  {/* Error Messages */}
                  <View className = "h-[10%] w-full items-center">
                    {error && (
                      <Text className = "text-red-500 text-base text-center m-2">{error}</Text>
                    )}
                  </View>

                  {/* Input Fields */}
                  <View className = "h-[30%] w-full items-center space-y-1">

                    <View className = "w-[75%] h-[20%] bg-white/75 rounded-full justify-center my-2">
                      <TextInput
                        className="h-full w-full text-black text-xl text-center self-center"
                        placeholder="Business Name"
                        placeholderTextColor={'gray'}
                        onChangeText={(text) => setBusinessName(text)}
                        value={businessName}
                        secureTextEntry={false}
                      />
                    </View>

                    <View className = "w-[75%] h-[20%] bg-white/75 rounded-full justify-center my-2">
                      <TextInput
                        className="h-full w-full text-black text-xl text-center self-center"
                        placeholder="User Amount"
                        placeholderTextColor={'gray'}
                        onChangeText={(text) => setUserAmount(text)}
                        value={userAmount}
                        secureTextEntry={false}
                      />
                    </View>

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
                  </View>

                  <View className = "h-[10%]"/>

                </>)}

                {/* Buttons */}

                <View className = "h-[20%] w-full flex-row justify-evenly items-center">

                  <View className="w-[40%] h-[30%] border-white border-2 bg-sky-400/50 rounded-full justify-center">
                    <TouchableOpacity onPress={handleSignup}>
                      <Text className="text-white text-xl text-center">Sign Up</Text>
                    </TouchableOpacity>
                  </View>

                  <View className = "w-[40%] h-[30%] bg-white border-2 border-sky-500 rounded-full justify-center">
                    <TouchableOpacity className = "w-full h-full justify-center" onPress={navigateToSignIn}>
                      <Text className = "text-black text-xl text-center">Go Back</Text>
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
            </View>
          </ScrollView>
          
        </LinearGradient>
      </View>
    </View>
  );
};

export default SignUpScreen;
