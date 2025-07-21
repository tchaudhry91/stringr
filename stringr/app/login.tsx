import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import { SharedStyles } from '@/styles/SharedStyles';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoginLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView 
      style={SharedStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={SharedStyles.contentContainer}>
        <Text style={SharedStyles.pageTitle}>Welcome Back</Text>
        <Text style={SharedStyles.subtitle}>Sign in to your Stringr account</Text>

        <View style={SharedStyles.form}>
          <TextInput
            style={SharedStyles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={SharedStyles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[SharedStyles.primaryButton, isLoginLoading && SharedStyles.primaryButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoginLoading}
          >
            <Text style={SharedStyles.primaryButtonText}>
              {isLoginLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={SharedStyles.linkButton}
            onPress={navigateToRegister}
          >
            <Text style={SharedStyles.linkText}>
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// All styles now use SharedStyles - no local styles needed
const styles = StyleSheet.create({});