import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, String as TennisString } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';


export default function AddStringModal() {
  const { returnTo, fieldType, racquetId } = useLocalSearchParams<{ 
    returnTo?: string;
    fieldType?: 'main' | 'cross';
    racquetId?: string;
  }>();
  const { user } = useAuth();

  const [form, setForm] = useState({
    brand: '',
    model: '',
    material: '',
    gauge: '',
    color: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.model.trim()) {
      Alert.alert('Error', 'String model is required');
      return;
    }

    setLoading(true);
    try {
      const data: Partial<TennisString> = {
        brand: form.brand.trim() || undefined,
        model: form.model.trim(),
        material: form.material || undefined,
        gauge: form.gauge.trim() || undefined,
        color: form.color || undefined,
        user: user?.id,
      };

      const newString = await api.strings.create(data);
      Alert.alert('Success', 'String added to database successfully');
      
      // Navigate back to the appropriate screen
      if (returnTo === 'string-job' && fieldType && racquetId) {
        // Return to string job form with the new string selected
        const params = new URLSearchParams({
          racquetId: racquetId,
          selectedStringId: newString.id,
          selectedStringField: fieldType,
        });
        router.replace(`/string-job-modal?${params.toString()}`);
      } else {
        // Return to string picker or back to previous screen
        router.back();
      }
    } catch (error) {
      console.error('Failed to create string:', error);
      Alert.alert('Error', 'Failed to add string to database');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };


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
            Add New String
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
          <Text style={SharedStyles.formLabel}>Brand</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.brand}
            onChangeText={(text) => setForm({ ...form, brand: text })}
            placeholder="Wilson, Babolat, Head, etc."
            autoCapitalize="words"
          />

          <Text style={SharedStyles.formLabel}>Model *</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.model}
            onChangeText={(text) => setForm({ ...form, model: text })}
            placeholder="Natural Gut, RPM Blast, etc."
            autoCapitalize="words"
          />

          <Text style={SharedStyles.formLabel}>Material</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.material}
            onChangeText={(text) => setForm({ ...form, material: text })}
            placeholder="Natural Gut, Polyester, Multifilament, etc."
            autoCapitalize="words"
          />

          <Text style={SharedStyles.formLabel}>Gauge</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.gauge}
            onChangeText={(text) => setForm({ ...form, gauge: text })}
            placeholder="16, 17, 1.25mm, etc."
          />

          <Text style={SharedStyles.formLabel}>Color</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.color}
            onChangeText={(text) => setForm({ ...form, color: text })}
            placeholder="Natural, Black, Blue, etc."
            autoCapitalize="words"
          />
        </View>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});