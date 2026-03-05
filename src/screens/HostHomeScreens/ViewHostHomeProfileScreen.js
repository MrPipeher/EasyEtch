import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { apiFetch } from '../../components/ApiConfig';

export default function ViewHostHomeProfileScreen() {
  const navigation = useNavigation();
  const user = FIREBASE_AUTH.currentUser;
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => { fetchProfiles(); }, [user])
  );

  const fetchProfiles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiFetch(`/hostHome/profiles?profileOwner=${user.email}`);
      setProfiles(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load your clients. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut(FIREBASE_AUTH) }
    ]);
  };

  const renderProfileCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardBody}
        onPress={() => navigation.navigate('GenerateNotes', { profile: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>{item.profileName}</Text>
          <Text style={styles.clientGender}>{item.profileGender || 'Client'}</Text>
        </View>
        
        {item.profileGoals ? (
          <Text style={styles.clientGoal} numberOfLines={2}>
            <Text style={styles.boldText}>Goal: </Text>{item.profileGoals}
          </Text>
        ) : null}
      </TouchableOpacity>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { profile: item })}>
          <Text style={styles.editText}>Edit ⚙️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.generateButton} onPress={() => navigation.navigate('GenerateNotes', { profile: item })}>
          <Text style={styles.generateText}>Generate Note ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Clients</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}><ActivityIndicator size="large" color="#007AFF" /></View>
      ) : profiles.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>You haven't added any clients yet.</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create one.</Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.profileId}
          renderItem={renderProfileCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateProfile')} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#F2F2F7' },
  title: { fontSize: 34, fontWeight: 'bold', color: '#000' },
  signOutButton: { padding: 8 },
  signOutText: { fontSize: 17, color: '#FF3B30', fontWeight: '600' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardBody: { padding: 20, paddingBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clientName: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  clientGender: { fontSize: 14, color: '#8E8E93', backgroundColor: '#E5E5EA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  clientGoal: { fontSize: 15, color: '#3A3A3C', lineHeight: 22 },
  boldText: { fontWeight: 'bold', color: '#000' },
  cardFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 8 },
  editButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#F2F2F7' },
  editText: { fontSize: 16, fontWeight: '600', color: '#8E8E93' },
  generateButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  generateText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#3A3A3C', textAlign: 'center', marginBottom: 8 },
  emptySubtext: { fontSize: 15, color: '#8E8E93', textAlign: 'center' },
  fab: { position: 'absolute', bottom: 30, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  fabIcon: { fontSize: 32, color: '#FFF', fontWeight: 'bold', lineHeight: 34 },
});