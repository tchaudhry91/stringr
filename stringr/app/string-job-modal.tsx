import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, Racquet, String as TennisString, StringJob } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';

export default function StringJobFormModal() {
  const { racquetId, selectedStringId, selectedStringField } = useLocalSearchParams<{ 
    racquetId: string;
    selectedStringId?: string;
    selectedStringField?: 'main' | 'cross';
  }>();
  const { user } = useAuth();

  const [racquet, setRacquet] = useState<Racquet | null>(null);
  const [strings, setStrings] = useState<TennisString[]>([]);
  const [form, setForm] = useState({
    mainStringId: '',
    crossStringId: '',
    tensionMainLbs: '',
    tensionCrossLbs: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Keep track of processed selections to avoid duplicate processing
  const [processedSelection, setProcessedSelection] = useState<string>('');

  useEffect(() => {
    loadInitialData();
  }, [racquetId]);

  // Handle string selection from picker
  useEffect(() => {
    const selectionKey = `${selectedStringId}-${selectedStringField}`;
    if (selectedStringId && selectedStringField && processedSelection !== selectionKey) {
      if (selectedStringField === 'main') {
        setForm(prev => ({ ...prev, mainStringId: selectedStringId }));
      } else if (selectedStringField === 'cross') {
        setForm(prev => ({ ...prev, crossStringId: selectedStringId }));
      }
      setProcessedSelection(selectionKey);
    }
  }, [selectedStringId, selectedStringField, processedSelection]);

  const loadInitialData = async () => {
    try {
      // Load the racquet
      const racquetData = await api.racquets.getById(racquetId);
      setRacquet(racquetData);

      // Load strings for selection
      const stringsData = await api.strings.list();
      setStrings(stringsData.items);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load racquet and strings');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.mainStringId) {
      Alert.alert('Error', 'Main string is required');
      return;
    }

    if (!form.tensionMainLbs || isNaN(Number(form.tensionMainLbs))) {
      Alert.alert('Error', 'Valid main tension is required');
      return;
    }

    setLoading(true);
    try {
      const data: Partial<StringJob> = {
        racquet: racquetId,
        main_string: form.mainStringId,
        cross_string: form.crossStringId || undefined,
        tension_lbs_main: Number(form.tensionMainLbs),
        tension_lbs_cross: form.tensionCrossLbs ? Number(form.tensionCrossLbs) : undefined,
        user: user?.id,
      };

      await api.stringJobs.create(data);
      Alert.alert('Success', 'String job created successfully');
      router.back();
    } catch (error) {
      console.error('Failed to create string job:', error);
      Alert.alert('Error', 'Failed to create string job');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const findStringById = (id: string) => {
    return strings.find(s => s.id === id);
  };

  const formatStringName = (string: TennisString) => {
    return [string.brand, string.model, string.gauge].filter(Boolean).join(' ');
  };

  if (initialLoading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading...</Text>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerShown: true,
        }} 
      />
      <ScrollView style={SharedStyles.formContainer}>
        <View style={SharedStyles.formHeader}>
          <Text style={SharedStyles.formTitle}>
            String {racquet?.name}
          </Text>
          <View style={SharedStyles.buttonRow}>
            <TouchableOpacity
              style={[SharedStyles.button, SharedStyles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={SharedStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[SharedStyles.button, SharedStyles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={SharedStyles.saveButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={SharedStyles.formContent}>
          <Text style={SharedStyles.formLabel}>Racquet</Text>
          <View style={styles.racquetInfo}>
            <Text style={styles.racquetName}>{racquet?.name}</Text>
            {racquet?.brand && racquet?.model && (
              <Text style={styles.racquetDetails}>
                {racquet.brand} {racquet.model}
              </Text>
            )}
          </View>

          <Text style={SharedStyles.formLabel}>Main String *</Text>
          <TouchableOpacity
            style={[SharedStyles.formInput, styles.picker]}
            onPress={() => {
              const params = new URLSearchParams({
                title: 'Select Main String',
                fieldType: 'main',
                onSelect: racquetId,
              });
              router.push(`/string-picker-modal?${params.toString()}`);
            }}
          >
            <Text style={styles.pickerText}>
              {form.mainStringId ? 
                formatStringName(findStringById(form.mainStringId)!) : 
                'Select main string...'
              }
            </Text>
          </TouchableOpacity>

          <Text style={SharedStyles.formLabel}>Cross String</Text>
          <TouchableOpacity
            style={[SharedStyles.formInput, styles.picker]}
            onPress={() => {
              const params = new URLSearchParams({
                title: 'Select Cross String',
                fieldType: 'cross',
                onSelect: racquetId,
              });
              router.push(`/string-picker-modal?${params.toString()}`);
            }}
          >
            <Text style={styles.pickerText}>
              {form.crossStringId ? 
                formatStringName(findStringById(form.crossStringId)!) : 
                'Select cross string (optional)...'
              }
            </Text>
          </TouchableOpacity>

          <Text style={SharedStyles.formLabel}>Main Tension (lbs) *</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.tensionMainLbs}
            onChangeText={(text) => setForm({ ...form, tensionMainLbs: text })}
            placeholder="55"
            keyboardType="numeric"
          />

          <Text style={SharedStyles.formLabel}>Cross Tension (lbs)</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.tensionCrossLbs}
            onChangeText={(text) => setForm({ ...form, tensionCrossLbs: text })}
            placeholder="53 (optional)"
            keyboardType="numeric"
          />

        </View>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  racquetInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  
  racquetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  racquetDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  
  picker: {
    justifyContent: 'center',
    minHeight: 48,
  },
  
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
});