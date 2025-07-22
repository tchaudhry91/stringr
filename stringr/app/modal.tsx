import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, Racquet } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';

export default function RacquetFormModal() {
  const { racquetId } = useLocalSearchParams<{ racquetId?: string }>();
  const { user } = useAuth();
  const isEditing = !!racquetId;

  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    pattern: '',
    weight: '',
    notes: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && racquetId) {
      loadRacquet(racquetId);
    }
  }, [racquetId, isEditing]);

  const loadRacquet = async (id: string) => {
    try {
      const racquet = await api.racquets.getById(id);
      setForm({
        name: racquet.name,
        brand: racquet.brand || '',
        model: racquet.model || '',
        pattern: racquet.pattern || '',
        weight: racquet.weight || '',
        notes: racquet.notes || '',
        year: racquet.year?.toString() || '',
      });
    } catch (error) {
      console.error('Failed to load racquet:', error);
      Alert.alert('Error', 'Failed to load racquet');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Racquet name is required');
      return;
    }

    setLoading(true);
    try {
      const data: Partial<Racquet> = {
        name: form.name.trim(),
        brand: form.brand.trim() || undefined,
        model: form.model.trim() || undefined,
        pattern: form.pattern.trim() || undefined,
        weight: form.weight.trim() || undefined,
        notes: form.notes.trim() || undefined,
        year: form.year.trim() ? parseInt(form.year) : undefined,
        user: user?.id,
      };

      if (isEditing && racquetId) {
        await api.racquets.update(racquetId, data);
        Alert.alert('Success', 'Racquet updated successfully');
      } else {
        await api.racquets.create(data);
        Alert.alert('Success', 'Racquet created successfully');
      }
      
      router.back();
    } catch (error) {
      console.error('Failed to save racquet:', error);
      Alert.alert('Error', 'Failed to save racquet');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (initialLoading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading racquet...</Text>
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
          {isEditing ? 'Edit Racquet' : 'Add New Racquet'}
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
        <Text style={SharedStyles.formLabel}>Name *</Text>
        <TextInput
          style={SharedStyles.formInput}
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          placeholder="My Pro Staff"
          autoCapitalize="words"
        />

        <Text style={SharedStyles.formLabel}>Brand</Text>
        <TextInput
          style={SharedStyles.formInput}
          value={form.brand}
          onChangeText={(text) => setForm({ ...form, brand: text })}
          placeholder="Wilson"
          autoCapitalize="words"
        />

        <Text style={SharedStyles.formLabel}>Model</Text>
        <TextInput
          style={SharedStyles.formInput}
          value={form.model}
          onChangeText={(text) => setForm({ ...form, model: text })}
          placeholder="Pro Staff 97"
          autoCapitalize="words"
        />

        <Text style={SharedStyles.formLabel}>String Pattern</Text>
        <TextInput
          style={SharedStyles.formInput}
          value={form.pattern}
          onChangeText={(text) => setForm({ ...form, pattern: text })}
          placeholder="16x19"
        />

        <Text style={SharedStyles.formLabel}>Weight</Text>
        <TextInput
          style={SharedStyles.formInput}
          value={form.weight}
          onChangeText={(text) => setForm({ ...form, weight: text })}
          placeholder="315g unstrung"
        />

        <Text style={SharedStyles.formLabel}>Year</Text>
        <TextInput
          style={SharedStyles.formInput}
          value={form.year}
          onChangeText={(text) => setForm({ ...form, year: text })}
          placeholder="2023"
          keyboardType="numeric"
        />

        <Text style={SharedStyles.formLabel}>Notes</Text>
        <TextInput
          style={[SharedStyles.formInput, SharedStyles.formTextArea]}
          value={form.notes}
          onChangeText={(text) => setForm({ ...form, notes: text })}
          placeholder="Additional notes about this racquet..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ScrollView>
    </>
  );
}

// All styles now use SharedStyles - no local styles needed
const styles = StyleSheet.create({});
