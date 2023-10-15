import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

const StripeCheckoutScreen = ({ route }) => {
  const { checkoutUrl } = route.params;
  const [result, setResult] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const openBrowserAsync = async () => {
      try {
        let result = await WebBrowser.openBrowserAsync(checkoutUrl);
        setResult(result);
      } catch (error) {
        console.error(error);
      }
    };
    openBrowserAsync();
    navigation.navigate('Generate');
  }, [checkoutUrl]); 

  return (
    <View style={{ flex: 1 }}>
      <Text>{result && JSON.stringify(result)}</Text>
    </View>
  );
};

export default StripeCheckoutScreen;
