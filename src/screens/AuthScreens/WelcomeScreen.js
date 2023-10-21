import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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

    //Outside Container
    <View className = "bg-white flex-1">

      {/* Main Container */}
      <View className = "h-[100%] w-[100%] max-w-[1080] self-center border-2 border-sky-500">

        {/* Background Image */}
        <Image 
          className = "w-full h-full absolute"
          source={require('../../../assets/images/Background.png')} 
        />

        {/* Header */}
        <View className = "h-[10%]"/>

        {/* Container */}
        <View className = "h-[60%]">
          <Image 
            className = "w-[50%] h-[70%] self-center"
            source={require('../../../assets/images/Logo.png')} 
          />
        </View>

        {/* Footer */}
        <View className = "h-[30%] flex-col items-center">

          <View className = {styles.actionButton}>
            <TouchableOpacity onPress={navigateToSignIn}>
              <Text className = {styles.actionButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
      
          <View className = {styles.button}>
            <TouchableOpacity onPress={navigateToSignUp}>
              <Text className = {styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </View>
  );
};

const styles = {
  button: "w-1/2 h-[25%] bg-white border-2 border-sky-500 rounded-md justify-center my-2",
  buttonText: "text-black text-xl text-center",
  actionButton: "w-1/2 h-[25%] bg-sky-500 rounded-md justify-center my-2",
  actionButtonText: "text-white text-xl text-center",
};

export default WelcomeScreen;
