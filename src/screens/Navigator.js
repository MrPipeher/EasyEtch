import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';
import { ServerURLProvider } from '../components/ServerURLContext';
import { ProfileProvider } from '../components/ProfileContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignInScreen from './AuthScreens/SignInScreen';
import SignUpScreen from './AuthScreens/SignUpScreen';
import WelcomeScreen from './AuthScreens/WelcomeScreen';
import GenerateScreen from './MainScreens/GenerateScreen';
import StripeCheckoutScreen from './StripeCheckoutScreen';
import PurchaseScreen from './MainScreens/PurchaseScreen';
import CreateProfileScreen from './MainScreens/CreateProfileScreen';
import ViewProfileScreen from './MainScreens/ViewProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigator = () => {
  
  const serverURL = 'https://10.0.0.70:5000';
  const [profileOwner, setProfileOwner] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setProfileOwner(user.email);
      } else {
        setProfileOwner(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const GenerateStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Generate" component={GenerateScreen}/>
        <Stack.Screen name="Purchase" component={PurchaseScreen}/>
        <Stack.Screen name="StripeCheckout" component={StripeCheckoutScreen}/>
      </Stack.Navigator>
     );
  };

  return (
    <ServerURLProvider serverURL={serverURL}> 
      <NavigationContainer>
        {profileOwner ? (
          <ProfileProvider profileOwner={profileOwner}>
            <Tab.Navigator screenOptions={{ headerShown: false }} >
              <Tab.Screen
                name="Create"
                component={GenerateStack}
              />
              <Tab.Screen
                name="CreateProfile"
                component={CreateProfileScreen}
              />
              <Tab.Screen
                name="ViewProfile"
                component={ViewProfileScreen}
              />
            </Tab.Navigator>
          </ProfileProvider>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ServerURLProvider>
  );
};

export default Navigator;
