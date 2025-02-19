import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';
import { ServerURLProvider } from '../components/ServerURLContext';
import { ServerProvider } from '../components/ServerContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './AuthScreens/SignInScreen';
import SignUpScreen from './AuthScreens/SignUpScreen';
import ForgotPasswordScreen from './AuthScreens/ForgotPasswordScreen';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  
  const serverURL = 'https://server5001.acserver.org';

  // Production: 'https://easyetch.onrender.com';
  // Testing: 'http://localhost:5000' 10.0.0.70:5000

  const [profileOwner, setProfileOwner] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user && user.emailVerified) {
        setProfileOwner(user.email);
      } else {
        setProfileOwner(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ServerURLProvider serverURL={serverURL}> 
      <NavigationContainer>
        {profileOwner ? (
        <ServerProvider profileOwner={profileOwner}>
          <MainNavigator />
        </ServerProvider>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ServerURLProvider>
  );
};

export default RootNavigator;
