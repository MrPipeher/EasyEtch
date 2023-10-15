import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfileContext } from '../../components/ProfileContext';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';

const GenerateScreen = () => {
  const { profiles, selectedProfile, setSelectedProfile, profileOwner } = useProfileContext();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
        const auth = FIREBASE_AUTH;
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handlePurchase = async () => {
    try {
        const response = await fetch('http://10.0.0.70:5000/checkout', {
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
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select a Profile:</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profileId}
        renderItem={({ item }) => (
          <Button
            title={item.profileName}
            onPress={() => handleProfileSelect(item)}
            disabled={item === selectedProfile}
          />
        )}
      />
      {selectedProfile && (
        <View>
          <Text>Product Title</Text>
          <Button title="Purchase!" onPress={handlePurchase} />
          <Text>Profile Gender: {selectedProfile.profileGender}</Text>
          <Text>Profile Goals: {selectedProfile.profileGoals}</Text>
          <Text>Profile Intervention: {selectedProfile.profileIntervention}</Text>
          <Text>Profile Objective: {selectedProfile.profileObjective}</Text>
          <Text>Profile Name: {selectedProfile.profileName}</Text>
        </View>
      )}
      <Text>Top of the morning!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default GenerateScreen;
