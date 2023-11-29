import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { useServerContext } from '../../components/ServerContext';
import { LinearGradient } from 'expo-linear-gradient';

const SettingsScreen = () => {
  const { accountType, changeAccountType, profileOwner, formattedBillingCycleEnd,
    status,
    usage,
    limit,
    tier, } = useServerContext();

  const handleSignOut = async () => {
    try {
      const auth = FIREBASE_AUTH;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAccountTypeChange = (newAccountType) => {
    changeAccountType(profileOwner, newAccountType);
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

            <View className = "h-[3%]">

              {status === 'active' && (
                <>
                  <Text className = "text-white font-bold text-xl">Subscription Tier: ({tier})</Text>
                  <Text className = "text-white font-bold text-xl">Status: {status}</Text>
                  <Text className = "text-white font-bold text-xl">Usage: {usage} / Limit: {limit}</Text>
                  <Text className = "text-white font-bold text-xl">End Date: {formattedBillingCycleEnd} </Text>
                </>
              )}

            </View>

            <View className = "h-[50%] w-full justify-center items-center space-y-2">

              <Text className = "text-white text-xl text-center">Account Type:</Text>

              {accountType == 'Host Home' ? (
                <View className = "w-[75%] h-[10%] bg-white border-2 border-green-500 rounded-full justify-center">
                  <TouchableOpacity onPress={() => handleAccountTypeChange('Host Home')}> 
                    <Text className = "text-black text-base text-center">Host Home</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className = "w-[75%] h-[10%] bg-white rounded-full justify-center">
                  <TouchableOpacity onPress={() => handleAccountTypeChange('Host Home')}> 
                    <Text className = "text-black text-base text-center">Host Home</Text>
                  </TouchableOpacity>
                </View>
              )}

              {accountType == 'Therapist' ? (
                <View className = "w-[75%] h-[10%] bg-white border-2 border-green-500 rounded-full justify-center">
                  <TouchableOpacity onPress={() => handleAccountTypeChange('Therapist')}> 
                    <Text className = "text-black text-base text-center">Therapist</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className = "w-[75%] h-[10%] bg-white rounded-full justify-center">
                  <TouchableOpacity onPress={() => handleAccountTypeChange('Therapist')}> 
                    <Text className = "text-black text-base text-center">Therapist</Text>
                  </TouchableOpacity>
                </View>
              )}

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
