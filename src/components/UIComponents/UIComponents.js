import React from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';

const CustomButton = ({ onPress, buttonText }) => {
    return (
        <View className={styles.button}>
            <TouchableOpacity onPress={onPress}>
                <Text className={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const CustomActionButton = ({ onPress, buttonText }) => {
    return (
        <View className={styles.actionButton}>
            <TouchableOpacity onPress={onPress}>
                <Text className={styles.actionButtonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const CustomInputField = ({ placeholder, onChangeText, value, secureTextEntry }) => {
    return (
        <View className = {styles.inputField}>
            <TextInput
                className={styles.inputFieldText}
                placeholder={placeholder}
                placeholderTextColor={'gray'}
                onChangeText={(text) => onChangeText(text)}
                value={value}
                secureTextEntry={secureTextEntry ? true : false}
            />
        </View>
    );
  };

const styles = {
    button: "w-[50%] h-[30%] bg-white rounded-xl justify-center my-2",

    buttonText: "text-black text-xl text-center",

    actionButton: "w-[50%] h-[30%] border-white border-2 bg-sky-400/50 rounded-xl justify-center my-2",

    actionButtonText: "text-white text-xl text-center",

    inputField: "w-[50%] h-[30%] bg-white/75 rounded-full justify-center my-2",
    
    inputFieldText: "h-full w-full text-black text-xl text-center self-center",
};

export {CustomButton, CustomActionButton, CustomInputField}
