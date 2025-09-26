import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { apiService } from '../services/api';
 import { LoadingSpinner } from '../components/LoadingSpinner';
import { StorageService } from '../services/storage';
import { router } from 'expo-router';

interface ActivationScreenProps {
  onActivationComplete: () => void;
}

 const ActivationScreen: React.FC<ActivationScreenProps> = ({
  onActivationComplete,
}) => {
  const [activationKey, setActivationKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleActivation = async () => {
    if (!activationKey.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une clé d\'activation');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.activate({ key: activationKey.trim() });
      console.log('Activation response:', response);
      if (response.success && response.userId) {
        // Store activation data securely
        await StorageService.storeActivation({
          userId: response.userId,
          expiresAt: response.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          activatedAt: new Date().toISOString(),
        });
        
        Alert.alert(
          'Activation réussie!',
          'Votre application est maintenant activée.',
          [{ text: 'Continuer', onPress: onActivationComplete }]
        );
        router.replace('/(tabs)/translator');
      } else {
        Alert.alert('Activation échouée', response.message || 'Clé d\'activation invalide');
      }
    } catch (error) {
      Alert.alert(
        'Erreur de connexion',
        'Impossible de vérifier la clé d\'activation. Vérifiez votre connexion internet.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Traducteur Rapide</Text>
          <Text style={styles.subtitle}>Activez votre application</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Clé d'activation</Text>
            <TextInput
              style={styles.input}
              value={activationKey}
              onChangeText={setActivationKey}
              placeholder="Entrez votre clé d'activation"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={false}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.button, !activationKey.trim() && styles.buttonDisabled]} 
            onPress={handleActivation}
            disabled={!activationKey.trim()}
          >
            <Text style={styles.buttonText}>Activer</Text>
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            Contactez le support si vous n'avez pas de clé d'activation
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ActivationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196f3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  helpText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
});