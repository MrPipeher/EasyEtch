import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useServerURL } from '../../components/ServerURLContext';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Host Home'); // Default value is 'Host Home'
  const serverURL = useServerURL();

  const handleSignup = async () => {
    try {
      const response = await fetch(`${serverURL}/common/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      if (response) {
        navigateToWelcome();
      } else {
        console.error('Error signing up on server:', errorData.error);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const navigateToWelcome = () => {
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container} className = "bg-red-500">
      <Text>Sign Up</Text>
      <Picker
        style={styles.picker}
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Host Home" value="Host Home" />
        <Picker.Item label="Therapist" value="Therapist" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Go Back" onPress={navigateToWelcome} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: '80%',
    marginVertical: 10,
  },
  input: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default SignUpScreen;
