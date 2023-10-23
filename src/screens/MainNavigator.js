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
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';

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
      <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

            <View className = "h-full w-full justify-center">
            <Text className = "text-white text-3xl text-center">Loading.. Please wait</Text>
            </View>
        </LinearGradient>
      </View>
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

  const TherapistProfileStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ViewProfile" component={ViewTherapistProfileScreen}/>
        <Stack.Screen name="CreateProfile" component={CreateTherapistProfileScreen}/>
      </Stack.Navigator>
     );
  };

  if (accountType === 'Host Home') {

    return (
      <HostHomeProfileProvider profileOwner={profileOwner}>
        <Tab.Navigator 
          initialRouteName="Profiles"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'white',
              borderColor: 'black',
              width: wp(100),
              maxWidth: 1080, // Set the specific width for the tab bar
              alignSelf: 'center',
          },
          tabBarIconStyle: {
            alignItems: 'center', // Center content vertically
            justifyContent: 'center', // Center content horizontally
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

  } else if (accountType === 'Therapist') {

    return (
      <TherapistProfileProvider profileOwner={profileOwner}>
        <Tab.Navigator 
          initialRouteName="Profiles"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'white',
              borderColor: 'black',
              width: wp(100),
              maxWidth: 1080, // Set the specific width for the tab bar
              alignSelf: 'center',
          },
          tabBarIconStyle: {
            alignItems: 'center', // Center content vertically
            justifyContent: 'center', // Center content horizontally
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
