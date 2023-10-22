import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { useServerContext } from '../components/ServerContext';
import { HostHomeProfileProvider } from '../components/HostHomeProfileContext'
import { TherapistProfileProvider } from '../components/TherapistProfileContext'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateHostHomeProfileScreen from './HostHomeScreens/CreateHostHomeProfileScreen'
import GenerateHostHomeNotesScreen from './HostHomeScreens/GenerateHostHomeNotesScreen'
import ViewHostHomeProfileScreen from './HostHomeScreens/ViewHostHomeProfileScreen'
import CreateTherapistProfileScreen from './TherapistScreens/CreateTherapistProfileScreen'
import GenerateTherapistNotesScreen from './TherapistScreens/GenerateTherapistNotesScreen'
import ViewTherapistProfileScreen from './TherapistScreens/ViewTherapistProfileScreen'
import SettingsScreen from './CommonScreens/SettingsScreen';
import PurchaseScreen from './CommonScreens/PurchaseScreen'
import StripeCheckoutScreen from './CommonScreens/StripeCheckoutScreen'

const MainNavigator = () => {
  const { accountType, profileOwner } = useServerContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accountType !== null) {
      setLoading(false);
    }
  }, [accountType]);

  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

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

  const HostHomeProfileStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ViewProfile" component={ViewHostHomeProfileScreen}/>
        <Stack.Screen name="CreateProfile" component={CreateHostHomeProfileScreen}/>
      </Stack.Navigator>
     );
  };

  const TherapistProfileStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ViewProfile" component={ViewTherapistProfileScreen}/>
        <Stack.Screen name="CreateProfile" component={CreateTherapistProfileScreen}/>
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

  if (accountType === 'Host Home') {

    return (
      <HostHomeProfileProvider profileOwner={profileOwner}>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
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

  } else if (accountType === 'Therapist') {

    return (
      <TherapistProfileProvider profileOwner={profileOwner}>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
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
            name="Profiles" 
            component={TherapistProfileStack} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={require('../../assets/navicons/user.png')}
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

export default MainNavigator;
