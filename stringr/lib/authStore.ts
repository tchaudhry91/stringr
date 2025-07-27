import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseAuthStore } from 'pocketbase';

export class AsyncAuthStore extends BaseAuthStore {
  private storageKey = 'pb_auth';

  constructor() {
    super();
    this.loadFromStorage();
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
    
    // Save to AsyncStorage
    AsyncStorage.setItem(
      this.storageKey,
      JSON.stringify({ token, model })
    ).catch((error) => {
      console.error('Failed to save auth to storage:', error);
    });
  }

  clear(): void {
    super.clear();
    
    // Clear from AsyncStorage
    AsyncStorage.removeItem(this.storageKey).catch((error) => {
      console.error('Failed to clear auth from storage:', error);
    });
  }
}