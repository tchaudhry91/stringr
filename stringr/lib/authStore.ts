import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseAuthStore } from 'pocketbase';
import { Platform } from 'react-native';

export class AsyncAuthStore extends BaseAuthStore {
  private storageKey = 'pb_auth';

  constructor() {
    super();
    // Only load from storage on client-side
    if (Platform.OS !== 'web' || typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  async loadFromStorage() {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      if (data) {
        const { token, model } = JSON.parse(data);
        this.save(token, model);
      }
    } catch (error) {
      console.error('Failed to load auth from storage:', error);
    }
  }

  save(token: string, model?: any): void {
    super.save(token, model);
    
    // Only save to AsyncStorage on client-side
    if (Platform.OS !== 'web' || typeof window !== 'undefined') {
      AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify({ token, model })
      ).catch((error) => {
        console.error('Failed to save auth to storage:', error);
      });
    }
  }

  clear(): void {
    super.clear();
    
    // Only clear from AsyncStorage on client-side
    if (Platform.OS !== 'web' || typeof window !== 'undefined') {
      AsyncStorage.removeItem(this.storageKey).catch((error) => {
        console.error('Failed to clear auth from storage:', error);
      });
    }
  }
}