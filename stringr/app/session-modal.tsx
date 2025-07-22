import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, Racquet, StringJobWithRelations, Session } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';

export default function SessionFormModal() {
  const { racquetId, stringJobId } = useLocalSearchParams<{ 
    racquetId: string;
    stringJobId?: string;
  }>();
  const { user } = useAuth();

  const [racquet, setRacquet] = useState<Racquet | null>(null);
  const [stringJobs, setStringJobs] = useState<StringJobWithRelations[]>([]);
  const [selectedStringJob, setSelectedStringJob] = useState<StringJobWithRelations | null>(null);
  const [form, setForm] = useState({
    stringJobId: stringJobId || '',
    durationHours: '',
    rating: '',
    stringBroken: false,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, [racquetId, stringJobId]);

  const loadInitialData = async () => {
    try {
      // Load the racquet
      const racquetData = await api.racquets.getById(racquetId);
      setRacquet(racquetData);

      // Load string jobs for this racquet
      const stringJobsResponse = await api.stringJobs.getByRacquet(racquetId);
      const stringJobsData = stringJobsResponse.items;
      setStringJobs(stringJobsData);

      // If a specific string job was provided, select it
      if (stringJobId) {
        const selectedJob = stringJobsData.find(job => job.id === stringJobId);
        if (selectedJob) {
          setSelectedStringJob(selectedJob);
          setForm(prev => ({ ...prev, stringJobId }));
        }
      } else if (stringJobsData.length > 0) {
        // Auto-select the most recent string job
        const mostRecent = stringJobsData[0]; // API returns sorted by created desc
        setSelectedStringJob(mostRecent);
        setForm(prev => ({ ...prev, stringJobId: mostRecent.id }));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load racquet and string jobs');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.stringJobId) {
      Alert.alert('Error', 'Please select a string job');
      return;
    }

    if (!form.durationHours || isNaN(Number(form.durationHours))) {
      Alert.alert('Error', 'Valid duration is required');
      return;
    }

    if (form.rating && (isNaN(Number(form.rating)) || Number(form.rating) < 1 || Number(form.rating) > 10)) {
      Alert.alert('Error', 'Rating must be between 1-10');
      return;
    }

    setLoading(true);
    try {
      const data: Partial<Session> = {
        string_job: form.stringJobId,
        duration_hours: Number(form.durationHours),
        rating: form.rating ? Number(form.rating) : undefined,
        string_broken: form.stringBroken,
        user: user?.id,
      };

      await api.sessions.create(data);
      Alert.alert('Success', 'Session recorded successfully');
      router.back();
    } catch (error) {
      console.error('Failed to create session:', error);
      Alert.alert('Error', 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const formatStringJobName = (job: StringJobWithRelations) => {
    const mainString = job.expand?.main_string;
    const tension = job.tension_lbs_main ? `${job.tension_lbs_main}lbs` : '';
    const stringName = mainString ? [mainString.brand, mainString.model].filter(Boolean).join(' ') : 'Unknown String';
    return `${stringName} ${tension}`.trim();
  };

  const formatTension = (main?: number, cross?: number) => {
    if (main && cross) {
      return main === cross ? `${main} lbs` : `${main}/${cross} lbs`;
    } else if (main) {
      return `${main} lbs`;
    }
    return 'Not specified';
  };

  if (initialLoading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading...</Text>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    );
  }

  if (stringJobs.length === 0) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: '',
            headerShown: true,
          }} 
        />
        <View style={SharedStyles.container}>
          <View style={SharedStyles.emptyState}>
            <Text style={SharedStyles.pageTitle}>No String Jobs</Text>
            <Text style={SharedStyles.subtitle}>
              You need to string this racquet first before recording a playing session.
            </Text>
            <TouchableOpacity
              style={SharedStyles.primaryButton}
              onPress={() => router.replace(`/string-job-modal?racquetId=${racquetId}`)}
            >
              <Text style={SharedStyles.primaryButtonText}>String Racquet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={SharedStyles.linkButton}
              onPress={handleCancel}
            >
              <Text style={SharedStyles.linkText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
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
            Record Session
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

          {selectedStringJob && (
            <>
              <Text style={SharedStyles.formLabel}>String Setup</Text>
              <View style={styles.stringJobInfo}>
                <Text style={styles.stringJobName}>
                  {formatStringJobName(selectedStringJob)}
                </Text>
                <Text style={styles.stringJobDetails}>
                  Tension: {formatTension(selectedStringJob.tension_lbs_main, selectedStringJob.tension_lbs_cross)}
                </Text>
                <Text style={styles.stringJobDetails}>
                  Strung on {new Date(selectedStringJob.created).toLocaleDateString()}
                </Text>
              </View>
            </>
          )}

          <Text style={SharedStyles.formLabel}>Duration (hours) *</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.durationHours}
            onChangeText={(text) => setForm({ ...form, durationHours: text })}
            placeholder="1.5"
            keyboardType="numeric"
          />

          <Text style={SharedStyles.formLabel}>Rating (1-10)</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.rating}
            onChangeText={(text) => setForm({ ...form, rating: text })}
            placeholder="8"
            keyboardType="numeric"
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, form.stringBroken && styles.checkboxChecked]}
              onPress={() => setForm({ ...form, stringBroken: !form.stringBroken })}
            >
              {form.stringBroken && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>String(s) broke during this session</Text>
          </View>

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

  stringJobInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  
  stringJobName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  
  stringJobDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});