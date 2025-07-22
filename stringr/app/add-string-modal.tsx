import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, TennisString } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';

const MATERIALS = [
  'Natural Gut',
  'Multifilament',
  'Synthetic Gut',
  'Polyester',
  'Co-Polyester',
  'Hybrid',
  'Kevlar',
  'Nylon'
];

const COLORS = [
  'Natural',
  'White',
  'Black',
  'Blue',
  'Red',
  'Yellow',
  'Green',
  'Orange',
  'Pink',
  'Purple',
  'Silver',
  'Gold'
];

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
    construction: '',
    tension_range_min: '',
    tension_range_max: '',
    durability: '',
    power: '',
    control: '',
    comfort: '',
    spin: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.model.trim()) {
      Alert.alert('Error', 'String model is required');
      return;
    }

    if (form.tension_range_min && isNaN(Number(form.tension_range_min))) {
      Alert.alert('Error', 'Minimum tension must be a number');
      return;
    }

    if (form.tension_range_max && isNaN(Number(form.tension_range_max))) {
      Alert.alert('Error', 'Maximum tension must be a number');
      return;
    }

    // Validate performance ratings (1-10 if provided)
    const performanceFields = ['durability', 'power', 'control', 'comfort', 'spin'];
    for (const field of performanceFields) {
      const value = form[field as keyof typeof form];
      if (value && (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 10)) {
        Alert.alert('Error', `${field.charAt(0).toUpperCase() + field.slice(1)} rating must be between 1-10`);
        return;
      }
    }

    setLoading(true);
    try {
      const data: Partial<TennisString> = {
        brand: form.brand.trim() || undefined,
        model: form.model.trim(),
        material: form.material || undefined,
        gauge: form.gauge.trim() || undefined,
        color: form.color || undefined,
        construction: form.construction.trim() || undefined,
        tension_range_min: form.tension_range_min ? Number(form.tension_range_min) : undefined,
        tension_range_max: form.tension_range_max ? Number(form.tension_range_max) : undefined,
        durability: form.durability ? Number(form.durability) : undefined,
        power: form.power ? Number(form.power) : undefined,
        control: form.control ? Number(form.control) : undefined,
        comfort: form.comfort ? Number(form.comfort) : undefined,
        spin: form.spin ? Number(form.spin) : undefined,
        notes: form.notes.trim() || undefined,
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

  const renderPicker = (
    label: string,
    value: string,
    options: string[],
    onSelect: (value: string) => void,
    placeholder: string
  ) => (
    <>
      <Text style={SharedStyles.formLabel}>{label}</Text>
      <TouchableOpacity
        style={[SharedStyles.formInput, styles.picker]}
        onPress={() => {
          Alert.alert(
            `Select ${label}`,
            '',
            [
              { text: 'Cancel', style: 'cancel' },
              ...options.map(option => ({
                text: option,
                onPress: () => onSelect(option)
              }))
            ]
          );
        }}
      >
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </>
  );

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

          {renderPicker(
            'Material',
            form.material,
            MATERIALS,
            (value) => setForm({ ...form, material: value }),
            'Select material...'
          )}

          <Text style={SharedStyles.formLabel}>Gauge</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.gauge}
            onChangeText={(text) => setForm({ ...form, gauge: text })}
            placeholder="16, 17, 1.25mm, etc."
          />

          {renderPicker(
            'Color',
            form.color,
            COLORS,
            (value) => setForm({ ...form, color: value }),
            'Select color...'
          )}

          <Text style={SharedStyles.formLabel}>Construction</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.construction}
            onChangeText={(text) => setForm({ ...form, construction: text })}
            placeholder="Monofilament, Textured, Spiral, etc."
          />

          <Text style={SharedStyles.formLabel}>Tension Range</Text>
          <View style={styles.tensionRow}>
            <TextInput
              style={[SharedStyles.formInput, styles.tensionInput]}
              value={form.tension_range_min}
              onChangeText={(text) => setForm({ ...form, tension_range_min: text })}
              placeholder="Min (lbs)"
              keyboardType="numeric"
            />
            <Text style={styles.tensionSeparator}>to</Text>
            <TextInput
              style={[SharedStyles.formInput, styles.tensionInput]}
              value={form.tension_range_max}
              onChangeText={(text) => setForm({ ...form, tension_range_max: text })}
              placeholder="Max (lbs)"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.performanceHeader}>Performance Ratings (1-10, optional)</Text>
          
          <Text style={SharedStyles.formLabel}>Durability</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.durability}
            onChangeText={(text) => setForm({ ...form, durability: text })}
            placeholder="1-10 (10 = most durable)"
            keyboardType="numeric"
          />

          <Text style={SharedStyles.formLabel}>Power</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.power}
            onChangeText={(text) => setForm({ ...form, power: text })}
            placeholder="1-10 (10 = most powerful)"
            keyboardType="numeric"
          />

          <Text style={SharedStyles.formLabel}>Control</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.control}
            onChangeText={(text) => setForm({ ...form, control: text })}
            placeholder="1-10 (10 = most control)"
            keyboardType="numeric"
          />

          <Text style={SharedStyles.formLabel}>Comfort</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.comfort}
            onChangeText={(text) => setForm({ ...form, comfort: text })}
            placeholder="1-10 (10 = most comfortable)"
            keyboardType="numeric"
          />

          <Text style={SharedStyles.formLabel}>Spin</Text>
          <TextInput
            style={SharedStyles.formInput}
            value={form.spin}
            onChangeText={(text) => setForm({ ...form, spin: text })}
            placeholder="1-10 (10 = most spin)"
            keyboardType="numeric"
          />

          <Text style={SharedStyles.formLabel}>Notes</Text>
          <TextInput
            style={[SharedStyles.formInput, SharedStyles.formTextArea]}
            value={form.notes}
            onChangeText={(text) => setForm({ ...form, notes: text })}
            placeholder="Additional notes about this string..."
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

const styles = StyleSheet.create({
  picker: {
    justifyContent: 'center',
    minHeight: 48,
  },
  
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  
  placeholderText: {
    color: '#999',
  },
  
  tensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  tensionInput: {
    flex: 1,
  },
  
  tensionSeparator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  
  performanceHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
});