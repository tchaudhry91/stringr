import { StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { SharedStyles } from '@/styles/SharedStyles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>Profile</Text>
      <View style={SharedStyles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View style={SharedStyles.userInfo}>
        <Text style={SharedStyles.label}>Name:</Text>
        <Text style={SharedStyles.value}>{user?.name || 'Not set'}</Text>
        
        <Text style={SharedStyles.label}>Email:</Text>
        <Text style={SharedStyles.value}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={SharedStyles.destructiveButton} onPress={handleLogout}>
        <Text style={SharedStyles.destructiveButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// All styles now use SharedStyles - no local styles needed
const styles = StyleSheet.create({});