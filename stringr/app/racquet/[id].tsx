import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, RefreshControl } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { SharedStyles } from '@/styles/SharedStyles';
import { api, Racquet, StringJob, Session } from '@/lib/pocketbase';

export default function RacquetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [racquet, setRacquet] = useState<Racquet | null>(null);
  const [stringJobs, setStringJobs] = useState<StringJob[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!id) return;
    
    try {
      // Load racquet details
      const racquetResult = await api.racquets.getById(id);
      setRacquet(racquetResult);

      // Load string jobs for this racquet
      const stringJobsResult = await api.stringJobs.getByRacquet(id);
      setStringJobs(stringJobsResult.items);

      // Load all sessions for this racquet's string jobs
      const allSessions: Session[] = [];
      for (const job of stringJobsResult.items) {
        const sessionsResult = await api.sessions.getByStringJob(job.id);
        allSessions.push(...sessionsResult.items);
      }
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load racquet data:', error);
      Alert.alert('Error', 'Failed to load racquet details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Reload data when screen comes into focus (e.g., after closing modal)
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getCurrentStringJob = () => {
    // Return the most recent string job (assuming the last one is current)
    return stringJobs.length > 0 ? stringJobs[stringJobs.length - 1] : null;
  };

  const handleDeleteStringJob = async (stringJob: StringJob) => {
    const isWeb = Platform.OS === 'web';
    let shouldDelete = false;
    
    if (isWeb) {
      shouldDelete = window.confirm('Are you sure you want to delete this string job?');
    } else {
      return new Promise((resolve) => {
        Alert.alert(
          'Delete String Job',
          'Are you sure you want to delete this string job?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      }).then(async (confirmed) => {
        if (confirmed) {
          await performDeleteStringJob(stringJob);
        }
      });
    }
    
    if (shouldDelete) {
      await performDeleteStringJob(stringJob);
    }
  };

  const performDeleteStringJob = async (stringJob: StringJob) => {
    try {
      await api.stringJobs.delete(stringJob.id);
      await loadData(); // Refresh data
      
      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'String job deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete string job:', error);
      
      if (Platform.OS === 'web') {
        alert(`Failed to delete string job: ${error}`);
      } else {
        Alert.alert('Error', `Failed to delete string job: ${error}`);
      }
    }
  };

  if (loading) {
    return (
      <View style={SharedStyles.loadingContainer}>
        <Text>Loading racquet details...</Text>
      </View>
    );
  }

  if (!racquet) {
    return (
      <View style={SharedStyles.container}>
        <Text style={SharedStyles.title}>Racquet not found</Text>
      </View>
    );
  }

  const currentStringJob = getCurrentStringJob();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'transparent' }}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Current State Section */}
      <Text style={SharedStyles.title}>{racquet.name}</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View 
        style={[
          SharedStyles.listItem, 
          { 
            marginBottom: 20,
            borderColor: 'rgba(128, 128, 128, 0.2)'
          }
        ]} 
        lightColor="#fff" 
        darkColor="#1c1c1e"
      >
        
        <View style={[styles.racquetDetails, { backgroundColor: 'transparent' }]}>
          {racquet.brand && <Text style={SharedStyles.listItemDetails}>Brand: {racquet.brand}</Text>}
          {racquet.model && <Text style={SharedStyles.listItemDetails}>Model: {racquet.model}</Text>}
          {racquet.pattern && <Text style={SharedStyles.listItemDetails}>Pattern: {racquet.pattern}</Text>}
          {racquet.weight && <Text style={SharedStyles.listItemDetails}>Weight: {racquet.weight}</Text>}
          {racquet.year && <Text style={SharedStyles.listItemDetails}>Year: {racquet.year}</Text>}
          {racquet.notes && (
            <Text style={[SharedStyles.listItemNotes, { marginTop: 8 }]}>
              Notes: {racquet.notes}
            </Text>
          )}
        </View>

        {currentStringJob && (
          <View style={[styles.currentStringsSection, { backgroundColor: 'transparent' }]}>
            <Text style={[SharedStyles.sectionTitle, { marginTop: 16 }]}>Current Strings</Text>
            <Text style={SharedStyles.listItemDetails}>
              Main: {currentStringJob.expand?.main_string?.brand} {currentStringJob.expand?.main_string?.model} @ {currentStringJob.tension_lbs_main}lbs
            </Text>
            {currentStringJob.cross_string && currentStringJob.expand?.cross_string && (
              <Text style={SharedStyles.listItemDetails}>
                Cross: {currentStringJob.expand.cross_string.brand} {currentStringJob.expand.cross_string.model} @ {currentStringJob.tension_lbs_cross}lbs
              </Text>
            )}
            <Text style={SharedStyles.listItemDetails}>
              Strung: {new Date(currentStringJob.created).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={[
          SharedStyles.listItemButtonRow, 
          { 
            marginTop: 16,
            borderTopColor: 'rgba(128, 128, 128, 0.2)',
            backgroundColor: 'transparent'
          }
        ]}>
          <TouchableOpacity
            style={SharedStyles.textButton}
            onPress={() => router.push(`/modal?racquetId=${racquet.id}`)}
          >
            <Text style={SharedStyles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={SharedStyles.textButton}
            onPress={() => router.push(`/string-job-modal?racquetId=${racquet.id}`)}
          >
            <Text style={SharedStyles.stringButtonText}>String</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={SharedStyles.textButton}
            onPress={() => router.push(`/session-modal?racquetId=${racquet.id}`)}
          >
            <Text style={SharedStyles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* String Jobs Section */}
      <Text style={SharedStyles.sectionTitle}>String Jobs ({stringJobs.length})</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {stringJobs.length === 0 ? (
        <View style={SharedStyles.emptyState}>
          <Text style={SharedStyles.emptyText}>No string jobs found</Text>
        </View>
      ) : (
        stringJobs.map((job, index) => (
          <View 
            key={job.id} 
            style={[
              SharedStyles.listItem,
              { borderColor: 'rgba(128, 128, 128, 0.2)' }
            ]} 
            lightColor="#fff" 
            darkColor="#1c1c1e"
          >
            <Text style={SharedStyles.listItemTitle}>
              String Job #{stringJobs.length - index}
            </Text>
            <Text style={SharedStyles.listItemDetails}>
              Main: {job.expand?.main_string?.brand} {job.expand?.main_string?.model} @ {job.tension_lbs_main}lbs
            </Text>
            {job.cross_string && job.expand?.cross_string && (
              <Text style={SharedStyles.listItemDetails}>
                Cross: {job.expand.cross_string.brand} {job.expand.cross_string.model} @ {job.tension_lbs_cross}lbs
              </Text>
            )}
            <Text style={SharedStyles.listItemDetails}>
              Date: {new Date(job.created).toLocaleDateString()}
            </Text>
            
            <View style={[
              SharedStyles.listItemButtonRow,
              { borderTopColor: 'rgba(128, 128, 128, 0.2)' }
            ]}>
              <TouchableOpacity
                style={SharedStyles.textButton}
                onPress={() => handleDeleteStringJob(job)}
              >
                <Text style={SharedStyles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Sessions Section */}
      <Text style={[SharedStyles.sectionTitle, { marginTop: 24 }]}>Play Sessions ({sessions.length})</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {sessions.length === 0 ? (
        <View style={SharedStyles.emptyState}>
          <Text style={SharedStyles.emptyText}>No play sessions found</Text>
        </View>
      ) : (
        sessions.map((session) => (
          <View 
            key={session.id} 
            style={[
              SharedStyles.listItem,
              { borderColor: 'rgba(128, 128, 128, 0.2)' }
            ]} 
            lightColor="#fff" 
            darkColor="#1c1c1e"
          >
            <Text style={SharedStyles.listItemTitle}>
              Session - {new Date(session.created).toLocaleDateString()}
            </Text>
            <Text style={SharedStyles.listItemDetails}>
              Duration: {session.duration_hours} hours
            </Text>
            {session.rating && (
              <Text style={SharedStyles.listItemDetails}>
                Rating: {session.rating}
              </Text>
            )}
            {session.string_broken && (
              <Text style={[SharedStyles.listItemDetails, { color: '#ff6b6b' }]}>
                String broken during session
              </Text>
            )}
            {session.notes && (
              <Text style={SharedStyles.listItemNotes}>
                {session.notes}
              </Text>
            )}
          </View>
        ))
      )}
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  currentStateHeader: {
    marginBottom: 12,
  },
  racquetDetails: {
    marginBottom: 8,
  },
  currentStringsSection: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
    paddingTop: 12,
  },
});