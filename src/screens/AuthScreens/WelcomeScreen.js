import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Our App!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={navigateToSignUp} />
        <Button title="Sign In" onPress={navigateToSignIn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default WelcomeScreen;
