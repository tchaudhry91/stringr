import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, View as RNView, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, Racquet } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';

export default function RacquetsScreen() {
  const [racquets, setRacquets] = useState<Racquet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadRacquets = async () => {
    try {
      const result = await api.racquets.list();
      setRacquets(result.items);
    } catch (error) {
      console.error('Failed to load racquets:', error);
      Alert.alert('Error', 'Failed to load racquets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRacquets();
  }, []);

  // Reload data when tab comes into focus (e.g., after closing modal)
  useFocusEffect(
    React.useCallback(() => {
      loadRacquets();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadRacquets();
  };

  const handleDeleteRacquet = async (racquet: Racquet) => {
    // Use browser confirm() for web, Alert for mobile
    const isWeb = Platform.OS === 'web';
    let shouldDelete = false;
    
    if (isWeb) {
      // Use browser's native confirm dialog for web
      shouldDelete = window.confirm(`Are you sure you want to delete "${racquet.name}"?`);
    } else {
      // Use React Native Alert for mobile
      return new Promise((resolve) => {
        Alert.alert(
          'Delete Racquet',
          `Are you sure you want to delete "${racquet.name}"?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => resolve(true)
            },
          ]
        );
      }).then(async (confirmed) => {
        if (confirmed) {
          await performDelete(racquet);
        }
      });
    }
    
    if (shouldDelete) {
      await performDelete(racquet);
    }
  };

  const performDelete = async (racquet: Racquet) => {
    try {
      await api.racquets.delete(racquet.id);
      
      // Force a fresh reload
      setRacquets([]);
      setLoading(true);
      await loadRacquets();
      
      // Success message (only for mobile, web is obvious)
      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'Racquet deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete racquet:', error);
      
      if (Platform.OS === 'web') {
        alert(`Failed to delete racquet: ${error}`);
      } else {
        Alert.alert('Error', `Failed to delete racquet: ${error}`);
      }
    }
  };

  const renderRacquet = ({ item }: { item: Racquet }) => (
    <TouchableOpacity
      style={SharedStyles.listItem}
      onPress={() => router.push(`/modal?racquetId=${item.id}`)}
    >
      <RNView style={SharedStyles.listItemHeader}>
        <Text style={SharedStyles.listItemTitle}>{item.name}</Text>
        <TouchableOpacity
          style={SharedStyles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteRacquet(item);
          }}
        >
          <Text style={SharedStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </RNView>
      <Text style={SharedStyles.listItemDetails}>
        {[item.brand, item.model].filter(Boolean).join(' ')}
      </Text>
      {item.pattern && (
        <Text style={SharedStyles.listItemDetails}>Pattern: {item.pattern}</Text>
      )}
      {item.weight && (
        <Text style={SharedStyles.listItemDetails}>Weight: {item.weight}</Text>
      )}
      {item.notes && (
        <Text style={SharedStyles.listItemNotes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading racquets...</Text>
      </View>
    );
  }

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>My Racquets</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {racquets.length === 0 ? (
        <View style={SharedStyles.emptyState}>
          <Text style={SharedStyles.tabSubtitle}>No racquets found</Text>
          <Text style={SharedStyles.emptyText}>
            Tap the + button to add your first racquet
          </Text>
        </View>
      ) : (
        <FlatList
          data={racquets}
          renderItem={renderRacquet}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={SharedStyles.list}
        />
      )}
    </View>
  );
}

// All styles now use SharedStyles - no local styles needed
const styles = StyleSheet.create({});
