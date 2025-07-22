import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, View as RNView, Text as RNText, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, StringJobWithRelations } from '@/lib/pocketbase';
import { useAuth } from '@/contexts/AuthContext';

export default function StringJobsScreen() {
  const [stringJobs, setStringJobs] = useState<StringJobWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadStringJobs = async () => {
    try {
      const result = await api.stringJobs.list();
      setStringJobs(result.items);
    } catch (error) {
      console.error('Failed to load string jobs:', error);
      Alert.alert('Error', 'Failed to load string jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStringJobs();
  }, []);

  // Reload data when tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadStringJobs();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadStringJobs();
  };

  const handleDeleteStringJob = async (stringJob: StringJobWithRelations) => {
    const racquetName = stringJob.expand?.racquet?.name || 'Unknown racquet';
    
    // Use browser confirm for web, Alert for mobile
    let confirmed = false;
    if (Platform.OS === 'web') {
      confirmed = window.confirm(`Are you sure you want to delete the string job for "${racquetName}"?`);
    } else {
      // For mobile, use Alert (this should work fine)
      Alert.alert(
        'Delete String Job',
        `Are you sure you want to delete the string job for "${racquetName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => { confirmed = true; },
          },
        ]
      );
    }
    
    if (confirmed) {
      try {
        await api.stringJobs.delete(stringJob.id);
        loadStringJobs();
      } catch (error) {
        console.error('Failed to delete string job:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete string job';
        if (Platform.OS === 'web') {
          alert(`Delete Failed: ${errorMessage}`);
        } else {
          Alert.alert('Delete Failed', `Error: ${errorMessage}`);
        }
      }
    }
  };

  const formatTension = (main?: number, cross?: number) => {
    if (main && cross) {
      return main === cross ? `${main} lbs` : `${main}/${cross} lbs`;
    } else if (main) {
      return `${main} lbs`;
    }
    return 'Not specified';
  };

  const renderStringJob = ({ item }: { item: StringJobWithRelations }) => (
    <View style={SharedStyles.listItem} lightColor="#fff" darkColor="#2c2c2e">
      <RNView style={styles.cardContent}>
        <RNView style={SharedStyles.listItemHeader}>
          <RNView style={SharedStyles.listItemTitleRow}>
            <Text style={SharedStyles.listItemTitle}>
              {item.expand?.racquet?.name || 'Unknown Racquet'}
            </Text>
          </RNView>
        </RNView>
        
        <Text style={SharedStyles.listItemDetails}>
          Tension: {formatTension(item.tension_lbs_main, item.tension_lbs_cross)}
        </Text>
        
        {item.expand?.main_string && (
          <Text style={SharedStyles.listItemDetails}>
            Main: {[item.expand.main_string.brand, item.expand.main_string.model].filter(Boolean).join(' ')}
          </Text>
        )}
        
        {item.expand?.cross_string && (
          <Text style={SharedStyles.listItemDetails}>
            Cross: {[item.expand.cross_string.brand, item.expand.cross_string.model].filter(Boolean).join(' ')}
          </Text>
        )}
        
        <Text style={SharedStyles.listItemNotes}>
          Strung on {new Date(item.created).toLocaleDateString()}
        </Text>

        <RNView style={SharedStyles.listItemButtonRow}>
          <TouchableOpacity
            style={SharedStyles.textButton}
            onPress={() => Alert.alert('Coming Soon', 'String job editing will be available in a future update')}
          >
            <Text style={SharedStyles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={SharedStyles.textButton}
            onPress={() => handleDeleteStringJob(item)}
          >
            <Text style={SharedStyles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </RNView>
      </RNView>
    </View>
  );

  if (loading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading string jobs...</Text>
      </View>
    );
  }

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>String Jobs</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {stringJobs.length === 0 ? (
        <View style={SharedStyles.emptyState}>
          <Text style={SharedStyles.tabSubtitle}>No string jobs found</Text>
          <Text style={SharedStyles.emptyText}>
            Create string jobs to track your racquet stringing history
          </Text>
        </View>
      ) : (
        <FlatList
          data={stringJobs}
          renderItem={renderStringJob}
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

const styles = StyleSheet.create({
  cardContent: {
    flex: 1,
  },
});
