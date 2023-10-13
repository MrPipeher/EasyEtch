import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { profileOwner } = params;

  const handleSignOut = async () => {
    try {
        const auth = FIREBASE_AUTH;
        await signOut(auth);
        navigation.navigate('Welcome');
    } catch (error) {
        console.error('Error signing out:', error);
    }
  };

  const handlePurchase = async () => {
    try {
        const response = await fetch('http://192.168.1.134:5000/checkout', {
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

  return (
    <View>
      <Text>{profileOwner}</Text>
      <Text>Product Title</Text>
      <Button title="Purchase!" onPress={handlePurchase} />
      <Text>Top of the morning!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default HomeScreen;
