import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import WelcomeScreen from './WelcomeScreen';
import HomeScreen from '../HomeScreen';
import StripeCheckoutScreen from '../StripeCheckoutScreen';
import CreateProfileScreen from '../MainScreens/CreateProfileScreen';
import ViewProfileScreen from '../MainScreens/ViewProfileScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = ({ route }) => {
  const { profileOwner } = route.params;
 return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} initialParams={{ profileOwner: profileOwner }} />
      <Stack.Screen name="StripeCheckout" component={StripeCheckoutScreen} initialParams={{ profileOwner: profileOwner }}/>
    </Stack.Navigator>
  );
};

const AuthNavigation = () => {
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

  return (
    <NavigationContainer>
      {profileOwner ? (
        <Tab.Navigator screenOptions={{ headerShown: false }} >
          <Tab.Screen
            name="Generate"
            component={HomeStack}
            initialParams={{ profileOwner: profileOwner }}
          />
          <Tab.Screen
            name="CreateProfile"
            component={CreateProfileScreen}
            initialParams={{ profileOwner: profileOwner }}
          />
          <Tab.Screen
            name="ViewProfile"
            component={ViewProfileScreen}
            initialParams={{ profileOwner: profileOwner }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
 
};

export default AuthNavigation;