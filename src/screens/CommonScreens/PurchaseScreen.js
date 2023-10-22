import React from 'react';
import { View, Text, Button, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServerContext } from '../../components/ServerContext';
import { useServerURL } from '../../components/ServerURLContext';
import { LinearGradient } from 'expo-linear-gradient';

const PurchaseScreen = () => {
  const { profileOwner } = useServerContext();
  const navigation = useNavigation();
  const serverURL = useServerURL();

  const handlePurchase = async (productTitle) => {
    try {
      const response = await fetch(`${serverURL}/common/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productTitle: productTitle,
          profileOwner: profileOwner,
        }),
      });

      const data = await response.json();
      if (data.url) {
        navigation.navigate('StripeCheckout', { checkoutUrl: data.url });
      } else {
        console.log('Unable to connect to stripe.')
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const navigateToGenerate = async () => {
    navigation.goBack();
  };  

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

        <View className = "w-full h-full justify-center items-center">

          <View className = "w-[75%] h-[10%] bg-white rounded-full m-2">
            <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handlePurchase('Credits1')}>
              <View className = "flex-row">
                <Text className = "w-[60%] text-black text-xl text-center">1 Credit</Text>
                <Text className = "w-[40%] text-black text-xl text-center">$5.99</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className = "w-[75%] h-[10%] bg-white rounded-full m-2">
            <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handlePurchase('Credits5')}>
              <View className = "flex-row">
                <Text className = "w-[60%] text-black text-xl text-center">5 Credits</Text>
                <Text className = "w-[40%] text-black text-xl text-center">$24.99</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className = "w-[75%] h-[10%] bg-white rounded-full m-2">
            <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handlePurchase('Credits15')}>
              <View className = "flex-row">
                <Text className = "w-[60%] text-black text-xl text-center">15 Credits</Text>
                <Text className = "w-[40%] text-black text-xl text-center">$59.99</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className = "w-[75%] h-[10%] bg-white rounded-full m-2">
            <TouchableOpacity className = "w-full h-full justify-center" onPress={() => handlePurchase('Credits30')}>
              <View className = "flex-row">
                <Text className = "w-[60%] text-black text-xl text-center">30 Credits</Text>
                <Text className = "w-[40%] text-black text-xl text-center">$99.99</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className = "w-[75%] h-[10%] bg-white rounded-full m-2">
            <TouchableOpacity className = "w-full h-full justify-center" onPress={navigateToGenerate}>
                <Text className = " text-black text-xl text-center">Go Back</Text>
            </TouchableOpacity>
          </View>

        </View>

        </LinearGradient>
      </View>
    </View>
  );
};

export default PurchaseScreen;
