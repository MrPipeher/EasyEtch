// src/screens/HostHomeScreens/GenerateHostHomeNotesScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Switch, 
  Alert,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { apiFetch } from '../../components/ApiConfig';

export default function GenerateHostHomeNotesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // We get the profile that was passed from the Dashboard card!
  const profile = route.params?.profile;
  const user = FIREBASE_AUTH.currentUser;

  const [dayProgram, setDayProgram] = useState(false);
  const [workedOnGoal, setWorkedOnGoal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  // If somehow no profile was passed, go back
  if (!profile) {
    navigation.goBack();
    return null;
  }

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/hostHome/generate?profileOwner=${user.email}`, {
        method: 'POST',
        body: JSON.stringify({
          selectedProfile: profile,
          dayProgram: dayProgram,
          workedOnGoal: workedOnGoal,
        }),
      });
      setNote(data.generatedText);
    } catch (error) {
      console.error('Error generating note:', error);
      Alert.alert('Error', 'Failed to generate the note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(note);
    Alert.alert('Copied! 📋', 'The note has been copied to your clipboard.', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const handleSave = () => {
    const currentDate = new Date();
    const dateString = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${currentDate.getFullYear()}`;
    const filename = `${profile.profileName}_${dateString}.txt`;

    if (Platform.OS === 'web') {
      // Create a Blob and download it (Perfect for her phone browser!)
      const blob = new Blob([note], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } else {
      // If you ever run this as a native app, Expo FileSystem/Sharing would go here.
      // But for GitHub Pages web app, the above is all you need.
      Alert.alert('Notice', 'File saving is optimized for the web browser version.');
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Writing note for {profile.profileName}...</Text>
      </View>
    );
  }

  // --- RESULT STATE (Note is generated) ---
  if (note) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Generated Note</Text>
        </View>

        <ScrollView style={styles.noteScroll} contentContainerStyle={{ padding: 20 }}>
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        </ScrollView>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCopy}>
            <Text style={styles.primaryButtonText}>Copy to Clipboard</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSave}>
              <Text style={styles.secondaryButtonText}>Save as .txt</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.secondaryButton, styles.resetButton]} onPress={() => setNote('')}>
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // --- SETUP STATE (Before generating) ---
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>➔ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Note</Text>
        <Text style={styles.subtitle}>For {profile.profileName}</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.card}>
          
          {/* First Toggle: Day Program */}
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Attended Day Program?</Text>
              <Text style={styles.rowSubtitle}>Include morning program activities</Text>
            </View>
            <Switch
              value={dayProgram}
              onValueChange={setDayProgram}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              ios_backgroundColor="#E5E5EA"
            />
          </View>

          {/* Divider line between toggles */}
          <View style={{ height: 1, backgroundColor: '#E5E5EA', marginVertical: 16 }} />

          {/* Second Toggle: Worked on Goal */}
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Worked on Goal?</Text>
              <Text style={styles.rowSubtitle}>Include a specific action taken towards: {profile.profileGoals}</Text>
            </View>
            <Switch
              value={workedOnGoal}
              onValueChange={setWorkedOnGoal}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }} // Make this one blue so they look distinct!
              ios_backgroundColor="#E5E5EA"
            />
          </View>

        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>Generate Magic ✨</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS light gray
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '500',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 22,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 4,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    paddingRight: 16,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF', // Apple Blue
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteScroll: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  noteText: {
    fontSize: 18,
    color: '#1C1C1E',
    lineHeight: 28, // High line height for easy reading
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F2F2F7',
  },
  primaryButton: {
    backgroundColor: '#34C759', // Apple Green for success/copy
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  resetButton: {
    marginLeft: 6,
    marginRight: 0,
    borderColor: '#FF3B30',
  },
  resetButtonText: {
    color: '#FF3B30',
    fontSize: 17,
    fontWeight: '600',
  },
});