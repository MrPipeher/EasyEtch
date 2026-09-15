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
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { FIREBASE_AUTH } from '../../components/FirebaseConfig';
import { apiFetch } from '../../components/ApiConfig';

export default function GenerateHostHomeNotesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const profile = route.params?.profile;
  const user = FIREBASE_AUTH.currentUser;

  // Form State
  const [dayProgram, setDayProgram] = useState(false);
  const [vitalsTaken, setVitalsTaken] = useState(true);
  const [workedOnGoal, setWorkedOnGoal] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  // Result & AI Adjustment State
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState('');

  if (!profile) {
    navigation.goBack();
    return null;
  }

  // Initial Note Generation
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/hostHome/generate?profileOwner=${user.email}`, {
        method: 'POST',
        body: JSON.stringify({
          selectedProfile: profile,
          dayProgram,
          vitalsTaken,
          workedOnGoal,
          customNotes: customNotes.trim(),
        }),
      });
      setNote(data.generatedText);
    } catch (error) {
      console.error('Error generating note:', error);
      Alert.alert('Error', 'Failed to generate note. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // AI Refine / Adjustment Request
  const handleRefine = async (instructionToUse) => {
    const textInstruction = instructionToUse || refineInstruction;
    if (!textInstruction.trim()) return;

    setRefining(true);
    try {
      const data = await apiFetch(`/hostHome/generate?profileOwner=${user.email}`, {
        method: 'POST',
        body: JSON.stringify({
          selectedProfile: profile,
          currentNote: note,
          instruction: textInstruction,
        }),
      });
      setNote(data.generatedText);
      setRefineInstruction('');
    } catch (error) {
      console.error('Error adjusting note:', error);
      Alert.alert('Error', 'Failed to adjust note. Please try again.');
    } finally {
      setRefining(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(note);
    Alert.alert('Copied! 📋', 'The note has been copied to your clipboard.');
  };

  const handleSave = () => {
    const currentDate = new Date();
    const dateString = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${currentDate.getFullYear()}`;
    const filename = `${profile.profileName}_${dateString}.txt`;

    if (Platform.OS === 'web') {
      const blob = new Blob([note], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } else {
      Alert.alert('Notice', 'File saving is optimized for the web version.');
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

  // --- RESULT STATE (Editable Note + Refine Tool) ---
  if (note) {
    return (
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setNote('')} style={styles.backButton}>
            <Text style={styles.backButtonText}>➔ Back to Options</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Daily Note</Text>
          <Text style={styles.subtitle}>Tap text below to edit directly</Text>
        </View>

        <ScrollView style={styles.noteScroll} contentContainerStyle={{ padding: 20 }}>
          {/* Editable Note Area */}
          <View style={styles.noteCard}>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              multiline
              scrollEnabled={false}
              placeholder="Your note will appear here..."
              placeholderTextColor="#8E8E93"
            />
          </View>

          {/* AI Adjust Tool Section */}
          <View style={styles.refineCard}>
            <Text style={styles.refineTitle}>🪄 Ask AI to Adjust Note</Text>

            {/* Quick action chips */}
            <View style={styles.chipRow}>
              <TouchableOpacity 
                style={styles.chip} 
                onPress={() => handleRefine("Make it a bit shorter and more concise")}
                disabled={refining}
              >
                <Text style={styles.chipText}>✂️ Make Shorter</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.chip} 
                onPress={() => handleRefine("Add that vitals were taken and recorded within normal limits")}
                disabled={refining}
              >
                <Text style={styles.chipText}>🩺 Add Vitals</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.chip} 
                onPress={() => handleRefine("Add more details about the evening and relaxing before bed")}
                disabled={refining}
              >
                <Text style={styles.chipText}>🌙 More Evening</Text>
              </TouchableOpacity>
            </View>

            {/* Custom instruction input */}
            <View style={styles.refineInputRow}>
              <TextInput
                style={styles.refineInput}
                placeholder="e.g. mention she watched a movie after dinner"
                placeholderTextColor="#8E8E93"
                value={refineInstruction}
                onChangeText={setRefineInstruction}
                editable={!refining}
              />
              <TouchableOpacity 
                style={[styles.refineButton, (!refineInstruction.trim() || refining) && styles.buttonDisabled]} 
                onPress={() => handleRefine(refineInstruction)}
                disabled={!refineInstruction.trim() || refining}
              >
                {refining ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.refineButtonText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCopy}>
            <Text style={styles.primaryButtonText}>Copy to Clipboard 📋</Text>
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
      </KeyboardAvoidingView>
    );
  }

  // --- SETUP / FORM STATE ---
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>➔ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Note</Text>
          <Text style={styles.subtitle}>For {profile.profileName}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.card}>
            
            {/* Toggle 1: Day Program */}
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Attended Day Program?</Text>
                <Text style={styles.rowSubtitle}>Leaves ~7:00 AM, returns ~3:00 PM</Text>
              </View>
              <Switch
                value={dayProgram}
                onValueChange={setDayProgram}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                ios_backgroundColor="#E5E5EA"
              />
            </View>

            <View style={styles.divider} />

            {/* Toggle 2: Vitals Taken */}
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Vitals Taken?</Text>
                <Text style={styles.rowSubtitle}>Recorded and checked by HHP</Text>
              </View>
              <Switch
                value={vitalsTaken}
                onValueChange={setVitalsTaken}
                trackColor={{ false: '#E5E5EA', true: '#FF9500' }}
                ios_backgroundColor="#E5E5EA"
              />
            </View>

            <View style={styles.divider} />

            {/* Toggle 3: Worked on Goal */}
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Worked on Goal?</Text>
                <Text style={styles.rowSubtitle}>
                  {profile.profileGoals ? profile.profileGoals : "Include goal progress"}
                </Text>
              </View>
              <Switch
                value={workedOnGoal}
                onValueChange={setWorkedOnGoal}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                ios_backgroundColor="#E5E5EA"
              />
            </View>

          </View>

          {/* Quick Notes / Extra Details Field */}
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.inputCardTitle}>Extra Details / Notes (Optional)</Text>
            <Text style={styles.inputCardSubtitle}>
              Mention anything specific (e.g. "watched movie after dinner", "ate pizza", "went for a walk")
            </Text>
            <TextInput
              style={styles.detailsInput}
              placeholder="Type any specific details here..."
              placeholderTextColor="#8E8E93"
              value={customNotes}
              onChangeText={setCustomNotes}
              multiline
              numberOfLines={3}
            />
          </View>

        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>Generate Magic ✨</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    marginBottom: 10,
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
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 4,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
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
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 14,
  },
  inputCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  inputCardSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
    marginBottom: 10,
  },
  detailsInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    height: 58,
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
    fontSize: 19,
    fontWeight: 'bold',
  },
  noteScroll: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
  },
  noteInput: {
    fontSize: 17,
    color: '#1C1C1E',
    lineHeight: 26,
    textAlignVertical: 'top',
  },
  refineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  refineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  refineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refineInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#000',
    marginRight: 8,
  },
  refineButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refineButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#F2F2F7',
    borderTopWidth: 1,
    borderColor: '#E5E5EA',
  },
  primaryButton: {
    backgroundColor: '#34C759',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    marginLeft: 6,
    marginRight: 0,
    borderColor: '#FF3B30',
  },
  resetButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});