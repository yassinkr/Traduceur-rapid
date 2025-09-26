import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Language, LanguageOption } from '../types';

interface LanguagePickerProps {
  label: string;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  excludeLanguage?: Language;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  label,
  selectedLanguage,
  onLanguageChange,
  excludeLanguage,
}) => {
  const availableLanguages = LANGUAGES.filter(lang => lang.code !== excludeLanguage);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.languageGrid}>
        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              selectedLanguage === language.code && styles.selectedButton,
            ]}
            onPress={() => onLanguageChange(language.code)}
          >
            <Text style={styles.flag}>{language.flag}</Text>
            <Text
              style={[
                styles.languageName,
                selectedLanguage === language.code && styles.selectedText,
              ]}
            >
              {language.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 120,
  },
  selectedButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  languageName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#1976d2',
    fontWeight: '600',
  },
});