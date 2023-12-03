import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useServerContext } from '../components/ServerContext';
import { BusinessProvider } from '../components/BusinessContext';
import { UserProvider } from '../components/UserContext';
import BusinessNavigator from './BusinessNavigator';
import UserNavigator from './UserNavigator';

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

  if (accountType === 'Business') {

    return (
      <BusinessProvider profileOwner={profileOwner}>
        <BusinessNavigator/>
      </BusinessProvider>
    );
  } else if (accountType === 'User') {

    return (
      <UserProvider profileOwner={profileOwner}> 
        <UserNavigator/>
      </UserProvider>
    );
  }
  return null;
};

export default MainNavigator;
