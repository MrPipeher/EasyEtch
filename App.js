import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/components/FirebaseConfig';

// Import Screens
import SignInScreen from './src/screens/AuthScreens/SignInScreen';
import ViewHostHomeProfileScreen from './src/screens/HostHomeScreens/ViewHostHomeProfileScreen';
import CreateHostHomeProfileScreen from './src/screens/HostHomeScreens/CreateHostHomeProfileScreen';
import EditHostHomeProfileScreen from './src/screens/HostHomeScreens/EditHostHomeProfileScreen';
import GenerateHostHomeNotesScreen from './src/screens/HostHomeScreens/GenerateHostHomeNotesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authenticatedUser) => {
      setUser(authenticatedUser ? authenticatedUser : null);
      setLoading(false);
    });
    return unsubscribe; 
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="ViewProfiles" component={ViewHostHomeProfileScreen} />
            <Stack.Screen name="CreateProfile" component={CreateHostHomeProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditHostHomeProfileScreen} />
            <Stack.Screen name="GenerateNotes" component={GenerateHostHomeNotesScreen} />
          </>
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' },
});