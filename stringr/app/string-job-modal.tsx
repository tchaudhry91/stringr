import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, Racquet, String as TennisString, StringJob } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';

type ViewMode = 'form' | 'selectMain' | 'selectCross';

export default function StringJobFormModal() {
  const { racquetId } = useLocalSearchParams<{ racquetId: string }>();
  const { user } = useAuth();

  const [racquet, setRacquet] = useState<Racquet | null>(null);
  const [strings, setStrings] = useState<TennisString[]>([]);
  const [filteredStrings, setFilteredStrings] = useState<TennisString[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<ViewMode>('form');
  const [form, setForm] = useState({
    mainStringId: '',
    crossStringId: '',
    tensionMainLbs: '',
    tensionCrossLbs: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, [racquetId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStrings(strings);
    } else {
      const filtered = strings.filter(string => 
        [string.brand, string.model, string.material, string.gauge]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredStrings(filtered);
    }
  }, [searchQuery, strings]);

  const loadInitialData = async () => {
    try {
      // Load the racquet
      const racquetData = await api.racquets.getById(racquetId);
      setRacquet(racquetData);

      // Load strings for selection
      const stringsData = await api.strings.list();
      setStrings(stringsData.items);
      setFilteredStrings(stringsData.items);
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
      router.navigate('/(tabs)');
    } catch (error) {
      console.error('Failed to create string job:', error);
      Alert.alert('Error', 'Failed to create string job');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentView !== 'form') {
      setCurrentView('form');
      setSearchQuery('');
    } else {
      router.back();
    }
  };

  const handleSelectString = (string: TennisString, field: 'main' | 'cross') => {
    if (field === 'main') {
      setForm(prev => ({ ...prev, mainStringId: string.id }));
    } else {
      setForm(prev => ({ ...prev, crossStringId: string.id }));
    }
    setCurrentView('form');
    setSearchQuery('');
  };

  const findStringById = (id: string) => {
    return strings.find(s => s.id === id);
  };

  const formatStringName = (string: TennisString) => {
    return [string.brand, string.model, string.gauge].filter(Boolean).join(' ');
  };

  const renderStringPicker = () => {
    const title = currentView === 'selectMain' ? 'Select Main String' : 'Select Cross String';
    const fieldType = currentView === 'selectMain' ? 'main' : 'cross';
    
    return (
      <View style={SharedStyles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search strings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const params = new URLSearchParams({
                returnTo: 'string-job',
                fieldType: fieldType,
                racquetId: racquetId,
              });
              router.push(`/add-string-modal?${params.toString()}`);
            }}
          >
            <Text style={styles.addButtonText}>+ Add New String</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredStrings}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.stringItem}
              onPress={() => handleSelectString(item, fieldType)}
            >
              <View style={styles.stringContent}>
                <Text style={styles.stringName}>
                  {formatStringName(item)}
                </Text>
                {item.material && (
                  <Text style={styles.stringDetails}>
                    Material: {item.material}
                  </Text>
                )}
                {item.color && (
                  <Text style={styles.stringDetails}>
                    Color: {item.color}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  if (initialLoading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading...</Text>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    );
  }

  const getTitle = () => {
    switch (currentView) {
      case 'selectMain': return 'Select Main String';
      case 'selectCross': return 'Select Cross String';
      default: return '';
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: getTitle(),
          headerShown: true,
        }} 
      />
      {currentView === 'form' ? (
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
            onPress={() => setCurrentView('selectMain')}
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
            onPress={() => setCurrentView('selectCross')}
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
      ) : (
        renderStringPicker()
      )}
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

  // String picker styles
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  
  addButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  list: {
    flex: 1,
  },
  
  stringItem: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  stringContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  
  stringName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  
  stringDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});