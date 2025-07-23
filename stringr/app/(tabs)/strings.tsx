import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TextInput, RefreshControl, TouchableOpacity, View as RNView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, String } from '@/lib/pocketbase';

export default function StringsScreen() {
  const [strings, setStrings] = useState<String[]>([]);
  const [filteredStrings, setFilteredStrings] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadStrings = async () => {
    try {
      const result = await api.strings.list(1, 200); // Load more strings for browsing
      setStrings(result.items);
      setFilteredStrings(result.items);
    } catch (error) {
      console.error('Failed to load strings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStrings();
  }, []);

  // Reload data when tab comes into focus (e.g., after adding a new string)
  useFocusEffect(
    React.useCallback(() => {
      loadStrings();
    }, [])
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStrings(strings);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = strings.filter(string => 
        (string.brand?.toLowerCase().includes(query)) ||
        (string.model?.toLowerCase().includes(query)) ||
        (string.material?.toLowerCase().includes(query)) ||
        (string.gauge?.toLowerCase().includes(query)) ||
        (string.color?.toLowerCase().includes(query))
      );
      setFilteredStrings(filtered);
    }
  }, [searchQuery, strings]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStrings();
  };

  const renderString = ({ item }: { item: String }) => (
    <View 
      style={[
        SharedStyles.listItem,
        { borderColor: 'rgba(128, 128, 128, 0.2)' }
      ]} 
      lightColor="#fff" 
      darkColor="#1c1c1e"
    >
      <RNView style={styles.cardContent}>
        <RNView style={SharedStyles.listItemTitleRow}>
          <Text style={SharedStyles.listItemTitle}>
            {[item.brand, item.model].filter(Boolean).join(' ') || 'Unknown String'}
          </Text>
        </RNView>
        
        {item.material && (
          <Text style={SharedStyles.listItemDetails}>
            Material: {item.material}
          </Text>
        )}
        
        {item.gauge && (
          <Text style={SharedStyles.listItemDetails}>
            Gauge: {item.gauge}
          </Text>
        )}
        
        {item.color && (
          <Text style={SharedStyles.listItemDetails}>
            Color: {item.color}
          </Text>
        )}
      </RNView>
    </View>
  );

  if (loading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading strings...</Text>
      </View>
    );
  }

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>String Database</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={SharedStyles.formInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search strings by brand, model, material, gauge..."
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-string-modal')}
        >
          <Text style={styles.addButtonText}>+ Add New String</Text>
        </TouchableOpacity>
      </View>
      
      {filteredStrings.length === 0 ? (
        <View style={SharedStyles.emptyState}>
          <Text style={SharedStyles.tabSubtitle}>
            {searchQuery ? 'No strings match your search' : 'No strings found'}
          </Text>
          <Text style={SharedStyles.emptyText}>
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'String database appears to be empty'
            }
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultCount}>
            {filteredStrings.length} string{filteredStrings.length === 1 ? '' : 's'} found
          </Text>
          <FlatList
            data={filteredStrings}
            renderItem={renderString}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={SharedStyles.list}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  
  addButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  resultCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
  },
});