import * as SecureStore from 'expo-secure-store';


const ACTIVATION_KEY = 'traducteur_activation';

export interface StoredActivation {
  userId: string;
  expiresAt: string;
  activatedAt: string;
}

export class StorageService {
  static async storeActivation(activation: StoredActivation): Promise<void> {
    try {
      console.log('Storing activation:', activation);
      await SecureStore.setItemAsync(ACTIVATION_KEY, JSON.stringify(activation));
    } catch (error) {
      console.error('Failed to store activation:', error);
      throw new Error('Failed to save activation data');
    }
  }

  static async getActivation(): Promise<StoredActivation | null> {
    try {
      const storedData = await SecureStore.getItemAsync(ACTIVATION_KEY);
      if (!storedData) return null;
      
      const activation: StoredActivation = JSON.parse(storedData);
      
      // Check if activation is still valid
      if (new Date(activation.expiresAt) < new Date()) {
        await this.clearActivation();
        return null;
      }
      
      return activation;
    } catch (error) {
      console.error('Failed to get activation:', error);
      return null;
    }
  }

  static async clearActivation(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACTIVATION_KEY);
    } catch (error) {
      console.error('Failed to clear activation:', error);
    }
  }

  static async isActivated(): Promise<boolean> {
    const activation = await this.getActivation();
    return activation !== null;
  }
}