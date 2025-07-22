import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, TennisString } from '@/lib/pocketbase';

export default function StringPickerModal() {
  const { onSelect, title, fieldType } = useLocalSearchParams<{ 
    onSelect?: string; 
    title?: string;
    fieldType?: 'main' | 'cross';
  }>();
  
  const [strings, setStrings] = useState<TennisString[]>([]);
  const [filteredStrings, setFilteredStrings] = useState<TennisString[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrings();
  }, []);

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

  const loadStrings = async () => {
    try {
      const result = await api.strings.list();
      setStrings(result.items);
      setFilteredStrings(result.items);
    } catch (error) {
      console.error('Failed to load strings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectString = (string: TennisString) => {
    // Navigate back to string job form with selected string
    const params = new URLSearchParams({
      racquetId: onSelect || '',
      selectedStringId: string.id,
      selectedStringField: fieldType || 'main',
    });
    router.replace(`/string-job-modal?${params.toString()}`);
  };

  const formatStringName = (string: TennisString) => {
    return [string.brand, string.model, string.gauge].filter(Boolean).join(' ');
  };

  const renderString = ({ item }: { item: TennisString }) => (
    <TouchableOpacity
      style={styles.stringItem}
      onPress={() => handleSelectString(item)}
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
  );

  if (loading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading strings...</Text>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: title || 'Select String',
          headerShown: true,
        }} 
      />
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
                fieldType: fieldType || 'main',
                racquetId: onSelect || '',
              });
              router.push(`/add-string-modal?${params.toString()}`);
            }}
          >
            <Text style={styles.addButtonText}>+ Add New String</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredStrings}
          renderItem={renderString}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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