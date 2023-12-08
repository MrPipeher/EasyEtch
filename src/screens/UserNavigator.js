import React from 'react';
import { Image } from 'react-native';
import { useUserContext } from '../components/UserContext';
import { HostHomeProfileProvider } from '../components/HostHomeProfileContext'
import { TherapistProfileProvider } from '../components/TherapistProfileContext'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateHostHomeProfileScreen from './HostHomeScreens/CreateHostHomeProfileScreen'
import GenerateHostHomeNotesScreen from './HostHomeScreens/GenerateHostHomeNotesScreen'
import ViewHostHomeProfileScreen from './HostHomeScreens/ViewHostHomeProfileScreen'
import GenerateTherapistNotesScreen from './TherapistScreens/GenerateTherapistNotesScreen'
import SettingsScreen from './CommonScreens/SettingsScreen';
import PurchaseScreen from './CommonScreens/PurchaseScreen'
import StripeCheckoutScreen from './CommonScreens/StripeCheckoutScreen'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const UserNavigator = () => {
  const { profession, profileOwner } = useUserContext();

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const HostHomeStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CreateHostHome" component={GenerateHostHomeNotesScreen}/>
        <Stack.Screen name="Purchase" component={PurchaseScreen}/>
        <Stack.Screen name="StripeCheckout" component={StripeCheckoutScreen}/>
      </Stack.Navigator>
     );
  };

  const TherapistStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CreateTherapist" component={GenerateTherapistNotesScreen}/>
        <Stack.Screen name="Purchase" component={PurchaseScreen}/>
        <Stack.Screen name="StripeCheckout" component={StripeCheckoutScreen}/>
      </Stack.Navigator>
     );
  };

  const HostHomeProfileStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ViewProfile" component={ViewHostHomeProfileScreen}/>
        <Stack.Screen name="CreateProfile" component={CreateHostHomeProfileScreen}/>
      </Stack.Navigator>
     );
  };

  if (profession === 'Host Home') {

    return (
      <HostHomeProfileProvider profileOwner={profileOwner}>
        <Tab.Navigator 
          initialRouteName="Profiles"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'white',
              borderColor: '#34abeb',
              borderWidth: 2,
              width: wp(100),
              maxWidth: 1080,
              alignSelf: 'center',
          },
          tabBarIconStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
            
          }}>
          <Tab.Screen 
            name="Generate" 
            component={HostHomeStack} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('../../assets/navicons/edit.png')}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}/>
          <Tab.Screen 
            name="Profiles" 
            component={HostHomeProfileStack} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('../../assets/navicons/user.png')}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('../../assets/navicons/settings.png')}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}/>
        </Tab.Navigator>
      </HostHomeProfileProvider>
    );

  } else if (profession === 'Therapist') {

    return (
      <TherapistProfileProvider profileOwner={profileOwner}>
        <Tab.Navigator 
          initialRouteName="Generate"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'white',
              borderColor: '#34abeb',
              borderWidth: 2,
              backgroundColor: 'white',
              borderColor: 'black',
              width: wp(100),
              maxWidth: 1080,
              alignSelf: 'center',
          },
          tabBarIconStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
            
          }}>
            <Tab.Screen 
              name="Generate" 
              component={TherapistStack} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Image
                    source={require('../../assets/navicons/edit.png')}
                    style={{ width: size, height: size, tintColor: color }}
                  />
                ),
              }}/>
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Image
                    source={require('../../assets/navicons/settings.png')}
                    style={{ width: size, height: size, tintColor: color }}
                  />
                ),
              }}/>
        </Tab.Navigator>
      </TherapistProfileProvider>
    );
  } 
  return null;
};

export default UserNavigator;
