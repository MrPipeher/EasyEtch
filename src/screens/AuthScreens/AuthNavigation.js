import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import WelcomeScreen from './WelcomeScreen';
import HomeScreen from '../HomeScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  const [profileOwner, setProfileOwner] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setProfileOwner(user.uid);
      } else {
        setProfileOwner(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures that effect runs once after initial render

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {profileOwner ? (
        <>
            <Stack.Screen name="Home" component={HomeScreen} />
        </>
        ) : (
        <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
        </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
