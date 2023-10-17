import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfileContext } from '../../components/ProfileContext';
import { useServerURL } from '../../components/ServerURLContext';

const PurchaseScreen = () => {
  const { profileOwner, reloadCredits } = useProfileContext();
  const navigation = useNavigation();
  const serverURL = useServerURL();

  const handlePurchase = async () => {
    try {
      const response = await fetch(`${serverURL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: 'price_1Nyke1ErsDMwjHJbsrjYiQC9',
          productTitle: 'Credits1',
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
    try {
      await reloadCredits();
      navigation.navigate('Generate');
    } catch (error) {
      console.log('Error reloading credits');
    }
  };  

  return (
    <View>
      <Button title="1 Credit" onPress={handlePurchase}></Button>
      <Button title="Go Back" onPress={navigateToGenerate} />
    </View>
  );
};

export default PurchaseScreen;
