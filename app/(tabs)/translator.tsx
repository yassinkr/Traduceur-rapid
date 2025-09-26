import React, { use, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
 import { apiService } from '../../services/api';
 import { Language } from '../../types';
import { StorageService } from '../../services/storage';
import { LanguagePicker } from '@/components/LanguagePicker';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRouter } from 'expo-router';
 

 const TranslatorScreen   = ( ) => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>('fr');
  const [targetLanguage, setTargetLanguage] = useState<Language>('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
 const router = useRouter();
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer du texte à traduire');
      return;
    }

    if (sourceLanguage === targetLanguage) {
      Alert.alert('Erreur', 'Veuillez sélectionner des langues différentes');
      return;
    }

    setIsTranslating(true);
    
    try {
      console.log('Translation request:', {
        text: inputText.trim(),
        source: sourceLanguage,
        target: targetLanguage,
      });
      const response = await apiService.translate({
        text: inputText.trim(),
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      });
      
      if (response.success && response.translatedText) {
        setTranslatedText(response.translatedText);
      } else {
        Alert.alert('Erreur de traduction', response.error || 'Impossible de traduire le texte');
      }
    } catch (error) {
      Alert.alert(
        'Erreur de connexion',
        'Impossible de traduire le texte. Vérifiez votre connexion internet.'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== targetLanguage) {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      
      // Also swap the text if both have content
      if (inputText && translatedText) {
        setInputText(translatedText);
        setTranslatedText(inputText);
      }
    }
  };

  const handleCopyToClipboard = async () => {
    if (translatedText) {
      await Clipboard.setStringAsync(translatedText);
      Alert.alert('Copié', 'Texte copié dans le presse-papiers');
    }
  };

  const handleShare = async () => {
    if (translatedText) {
      try {
        await Share.share({
          message: translatedText,
        });
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de partager le texte');
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearActivation();
            router.replace('/activation');
          },
        },
      ]
    );
  };

  const clearText = () => {
    setInputText('');
    setTranslatedText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Traducteur Rapide</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Déconnecter</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.languageSection}>
          <View style={styles.languageContainer}>
            <LanguagePicker
              label="De:"
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              excludeLanguage={targetLanguage}
            />
          </View>
          
          <TouchableOpacity onPress={handleSwapLanguages} style={styles.swapButton}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>
          
          <View style={styles.languageContainer}>
            <LanguagePicker
              label="Vers:"
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
              excludeLanguage={sourceLanguage}
            />
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.sectionLabel}>Texte à traduire:</Text>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tapez votre texte ici..."
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>{inputText.length}/500</Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.translateButton, !inputText.trim() && styles.buttonDisabled]}
            onPress={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
          >
            {isTranslating ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <Text style={styles.translateButtonText}>Traduire</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={clearText} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Effacer</Text>
          </TouchableOpacity>
        </View>

        {translatedText ? (
          <View style={styles.resultSection}>
            <Text style={styles.sectionLabel}>Traduction:</Text>
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>{translatedText}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleCopyToClipboard} style={styles.actionButton}>
                <Text style={styles.actionButtonText}>📋 Copier</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                <Text style={styles.actionButtonText}>📤 Partager</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TranslatorScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  logoutText: {
    color: '#666',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  languageContainer: {
    flex: 1,
  },
  swapButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  swapIcon: {
    fontSize: 20,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  textSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    lineHeight: 22,
  },
  characterCount: {
    textAlign: 'right',
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  translateButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  translateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  resultSection: {
    marginBottom: 20,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 80,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});