import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ViewBusiness from './BusinessScreens/ViewBusiness';

const BusinessNavigator = () => {

  const Tab = createBottomTabNavigator();

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
    </Tab.Navigator>
  );
}

export default BusinessNavigator;
