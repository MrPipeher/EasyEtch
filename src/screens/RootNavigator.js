import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';
import { ServerURLProvider } from '../components/ServerURLContext';
import { ServerProvider } from '../components/ServerContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './AuthScreens/SignInScreen';
import SignUpScreen from './AuthScreens/SignUpScreen';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  
  const serverURL = 'http://10.0.0.70:5000' // Production: 'https://easyetch.onrender.com';
  const [profileOwner, setProfileOwner] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
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
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ServerURLProvider>
  );
};

export default RootNavigator;