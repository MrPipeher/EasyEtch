import React, {useState} from 'react';
import { View, Text, TouchableOpacity, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';
import { useServerContext } from '../../components/ServerContext';
import { useBusinessContext } from '../../components/BusinessContext';

const BusinessPurchaseScreen = () => {
  const { subscription, formattedBillingCycleEnd, subscriptionCredits, subscriptionProductId} = useBusinessContext();
  const { profileOwner } = useServerContext();
  const navigation = useNavigation();
  const serverURL = useServerURL();
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(0);
  const [creditPrice, setCreditPrice] = useState(5.99);

  const handlePurchase = async (productTitle) => {
    try {

      if ((productTitle === 'Credits1' && quantity === 0) || (productTitle !== 'Credits1' && subscriptionProductId === 'default')) {
        return;
      }

      const response = await fetch(`${serverURL}/common/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          profileOwner: profileOwner,
          quantity: quantity,
          productTitle: productTitle,
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
    navigation.navigate('View');
  };  

  const handleInputChange = (text) => {
    if (/^\d+$/.test(text)) {
      setQuantity(text);
      calculatePrice(text);
    } else {
      setQuantity('');
      setPrice(0);
    }
  };

  const calculatePrice = (text) => {
    const parsedQuantity = parseInt(text, 10);
    const calculatedPrice = parsedQuantity * creditPrice;
    setPrice(calculatedPrice);
  };

  return (
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center">

        {/* Background Gradient */}
        <LinearGradient 
          className = "h-full w-full absolute" 
          colors={['#88daf7', '#66c4ff', '#008bff']}>

          <View className = "w-full h-full justify-center items-center space-y-2">

            {/* Header */}
            <View className = "h-[10%]"/>

            <View className = "h-[10%] justify-center items-center">

              <Text className = "text-white text-2xl font-bold text-center">Subscriptions (30 days)</Text>

            </View>

            {/*Sub Info*/}
            <View className = "h-[15%] w-[80%]">

                <View className = "w-full h-full justify-evenly">
                  {subscription === 'active' ? (
                    <>
                      <View className = "flex-row justify-center items-center w-full h-[40%] border-2 border-black bg-white rounded-lg"> 
                        <Text className = "w-[60%] text-black text-base text-center">Next Payment: {formattedBillingCycleEnd}</Text>
                        <Text className = "w-[60%] text-black text-base text-center">Notes per month: {subscriptionCredits}</Text>
                        <Text className = "w-[20%] text-black text-base text-center">Owned</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity className = "w-full h-[40%]" onPress={() => handlePurchase('default')}>
                        <View className = "flex-row justify-center items-center w-full h-full border-2 border-black bg-white rounded-lg"> 
                          <Text className = "w-[60%] text-black text-base text-center">contact us</Text>
                          <Text className = "w-[20%] text-black text-base text-center">price</Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

            </View>

            <View className = "h-[20%]">
                  
              <Text className = "text-white text-2xl font-bold text-center">Contact Us:</Text>
              <Text className = "text-white text-2xl font-bold text-center">easyetchsupport@gmail.com</Text>
              <Text className = "text-white text-2xl font-bold text-center">(404) 518-9797</Text>
                    
            </View>

            <Text className = "text-white text-2xl font-bold text-center">1 Credit = 1 Note</Text>
            <Text className = "text-white text-2xl font-bold text-center">{creditPrice}</Text>

            {/* Credits */}
            <View className = "h-[40%] w-full items-center">

              <View className = "w-[75%] h-[50%]">
                <View className = "flex-row w-full h-[50%] justify-center items-center bg-white border-black border-2">

                  <Text className = "w-[30%] text-black text-base text-center">Buy Credits?</Text>

                  <TextInput className = "w-[40%] h-full border-2 border-black/10 text-center"
                    keyboardType="numeric"
                    placeholder="Enter Amount"
                    value={quantity}
                    onChangeText={handleInputChange}
                  />

                  <TouchableOpacity className = "w-[30%] h-full justify-center items-center" onPress={() => handlePurchase('Credits1')}>
                    <View className = "w-[75%] h-[80%] justify-center items-center rounded-2xl bg-green-500"> 
                      <Text className = "text-black text-base text-center">${price.toFixed(2)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default BusinessPurchaseScreen;
