import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserContext } from '../../components/UserContext';

const SettingsScreen = () => {
  const { formattedBillingCycleEnd,
    subscription,
    subscriptionCredits,
    businessName,
    profession,
    isBusiness,
  } = useUserContext();

  const handleSignOut = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "h-full w-full justify-center items-center space-y-4">

            <View className = "h-[10%]"/>

            <View className = "h-[30%] w-[80%]">

              {subscription === 'active' && (
                <>
                  <View className = "bg-white h-full w-full justify-evenly items-center rounded-2xl">
                    <Text className = "text-black text-xl">Status: {subscription}</Text>
                    <Text className = "text-black text-xl">Credits per month: {subscriptionCredits}</Text>
                    <Text className = "text-black text-xl">End Date: {formattedBillingCycleEnd} </Text>
                  </View>
                </>
              )}

            </View>

            <View className = "h-[20%] w-full justify-center items-center space-y-2">

              {isBusiness && (
                <Text className="text-white text-xl text-center">Business: {businessName}</Text>
              )}

              <Text className = "text-white text-xl text-center">Profession: {profession}</Text>

            </View>

            <View className = "h-[20%] w-full items-center">
              <Text className = "text-white text-xl text-center">Contact Us:</Text>
              <Text className = "text-white text-xl text-center">Email: easyetchsupport@gmail.com</Text>
            </View>

            <View className = "h-[20%] w-full items-center">
              <View className = "w-[75%] h-[50%] bg-white rounded-full justify-center">
                <TouchableOpacity onPress={handleSignOut}> 
                  <Text className = "text-black text-base text-center">Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default SettingsScreen;
