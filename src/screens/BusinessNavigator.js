import React from 'react';
import { Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ViewBusiness from './BusinessScreens/ViewBusiness';
import BusinessPurchaseScreen from './BusinessScreens/BusinessPurchaseScreen';
import StripeCheckoutScreen from './CommonScreens/StripeCheckoutScreen';

const BusinessNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const BusinessStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PurchaseBusiness" component={BusinessPurchaseScreen}/>
        <Stack.Screen name="StripeCheckout" component={StripeCheckoutScreen}/>
      </Stack.Navigator>
     );
  };

  return (
    <Tab.Navigator 
      initialRouteName="View"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
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
        name="View" 
        component={ViewBusiness} 
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
        name="Purchase" 
        component={BusinessStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/navicons/money.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BusinessNavigator;
