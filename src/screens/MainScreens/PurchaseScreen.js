import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfileContext } from '../../components/ProfileContext';
import { useServerURL } from '../../components/ServerURLContext';

const PurchaseScreen = () => {
  const { profileOwner, reloadCredits } = useProfileContext();
  const navigation = useNavigation();
  const serverURL = useServerURL();

  const handlePurchase = async (productTitle) => {
    try {
      const response = await fetch(`${serverURL}/checkout`, {
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
    try {
      await reloadCredits();
      navigation.navigate('Generate');
    } catch (error) {
      console.log('Error reloading credits');
    }
  };  

  return (
    <View>
      <Button title="1 Credit" onPress={() => handlePurchase('Credits1')} />
      <Button title="5 Credits" onPress={() => handlePurchase('Credits5')} />
      <Button title="15 Credits" onPress={() => handlePurchase('Credits15')} />
      <Button title="30 Credits" onPress={() => handlePurchase('Credits30')} />
      <Button title="Go Back" onPress={navigateToGenerate} />
    </View>
  );
};

export default PurchaseScreen;
