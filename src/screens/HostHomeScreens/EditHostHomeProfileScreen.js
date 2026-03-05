import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { apiFetch } from '../../components/ApiConfig';

export default function EditHostHomeProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const profile = route.params?.profile;
  const user = FIREBASE_AUTH.currentUser;

  if (!profile) { navigation.goBack(); return null; }

  const [loading, setLoading] = useState(false);
  
  // Initialize state with existing profile data
  const [profileName, setProfileName] = useState(profile.profileName);
  const [profileGender, setProfileGender] = useState(profile.profileGender || '');
  const [profileGoals, setProfileGoals] = useState(profile.profileGoals || '');
  const [morningMedication, setMorningMedication] = useState(profile.morningMedication);
  const [afternoonMedication, setAfternoonMedication] = useState(profile.afternoonMedication);
  const [nightMedication, setNightMedication] = useState(profile.nightMedication);
  
  // Activities array state
  const [activities, setActivities] = useState(profile.activities && profile.activities.length > 0 ? profile.activities : ['']);

  const handleUpdateActivity = (text, index) => {
    const newActivities = [...activities];
    newActivities[index] = text;
    setActivities(newActivities);
  };

  const handleRemoveActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  const handleAddActivity = () => {
    setActivities([...activities, '']);
  };

  const handleSave = async () => {
    if (!profileName.trim()) {
      Alert.alert('Hold up!', 'Please enter the client\'s name.');
      return;
    }

    setLoading(true);

    // Filter out empty activities before saving
    const cleanedActivities = activities.map(a => a.trim()).filter(a => a !== '');

    const updatedProfileData = {
      profileName: profileName.trim(),
      profileGender: profileGender.trim(),
      profileGoals: profileGoals.trim(),
      morningMedication,
      afternoonMedication,
      nightMedication,
      activities: cleanedActivities,
    };

    try {
      await apiFetch('/hostHome/updateprofile', {
        method: 'PUT',
        body: JSON.stringify({
          profileOwner: user.email,
          profileId: profile.profileId,
          updatedProfileData
        }),
      });
      
      Alert.alert('Saved!', 'Client profile updated successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('ViewProfiles') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not update the profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${profileName}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            setLoading(true);
            try {
              await apiFetch('/hostHome/deleteprofile', {
                method: 'DELETE',
                body: JSON.stringify({ profileOwner: user.email, profileId: profile.profileId }),
              });
              navigation.navigate('ViewProfiles');
            } catch (error) {
              Alert.alert('Error', 'Could not delete the profile.');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>➔ Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Client</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Basic Info */}
        <View style={styles.card}>
          <Text style={styles.label}>Client Name</Text>
          <TextInput style={styles.input} value={profileName} onChangeText={setProfileName} />

          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.input} value={profileGender} onChangeText={setProfileGender} />

          <Text style={styles.label}>Primary Goal</Text>
          <TextInput style={[styles.input, styles.textArea]} multiline value={profileGoals} onChangeText={setProfileGoals} />
        </View>

        {/* Medications */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Morning Meds</Text>
            <Switch value={morningMedication} onValueChange={setMorningMedication} trackColor={{ true: '#34C759' }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Afternoon Meds</Text>
            <Switch value={afternoonMedication} onValueChange={setAfternoonMedication} trackColor={{ true: '#34C759' }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Night Meds</Text>
            <Switch value={nightMedication} onValueChange={setNightMedication} trackColor={{ true: '#34C759' }} />
          </View>
        </View>

        {/* Dynamic Activities List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Daily Activities</Text>
          <Text style={styles.subtext}>Edit individually or add new ones.</Text>
          
          {activities.map((activity, index) => (
            <View key={index} style={styles.activityRow}>
              <TextInput
                style={[styles.input, styles.activityInput]}
                placeholder="e.g. Coloring"
                value={activity}
                onChangeText={(text) => handleUpdateActivity(text, index)}
              />
              <TouchableOpacity style={styles.deleteActivityBtn} onPress={() => handleRemoveActivity(index)}>
                <Text style={styles.deleteActivityText}>⛔</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addActivityBtn} onPress={handleAddActivity}>
            <Text style={styles.addActivityText}>+ Add Activity</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <TouchableOpacity style={styles.deleteProfileBtn} onPress={handleDelete}>
          <Text style={styles.deleteProfileText}>Delete Client</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, backgroundColor: '#F2F2F7' },
  backButton: { marginBottom: 12 },
  backButtonText: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  title: { fontSize: 34, fontWeight: 'bold', color: '#000' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 16 },
  subtext: { fontSize: 15, color: '#8E8E93', marginBottom: 16, marginTop: -8 },
  label: { fontSize: 14, fontWeight: '600', color: '#8E8E93', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#F2F2F7', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 17, color: '#000', marginBottom: 20 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  switchLabel: { fontSize: 17, fontWeight: '500', color: '#000' },
  divider: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 8 },
  
  // Dynamic Activity Styles
  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  activityInput: { flex: 1, marginBottom: 0 },
  deleteActivityBtn: { padding: 12, marginLeft: 8 },
  deleteActivityText: { fontSize: 20 },
  addActivityBtn: { alignSelf: 'flex-start', paddingVertical: 8 },
  addActivityText: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  
  // Delete Profile Button
  deleteProfileBtn: { backgroundColor: '#FFEBEB', borderRadius: 16, padding: 20, alignItems: 'center', marginTop: 10 },
  deleteProfileText: { color: '#FF3B30', fontSize: 18, fontWeight: 'bold' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, backgroundColor: 'rgba(242, 242, 247, 0.9)' },
  saveButton: { backgroundColor: '#007AFF', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  saveButtonDisabled: { backgroundColor: '#A1C6EA' },
  saveButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
});