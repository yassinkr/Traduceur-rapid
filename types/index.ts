export interface ActivationRequest {
  key: string;
}

export interface ActivationResponse {
  success: boolean;
  message: string;
  userId?: string;
  expiresAt?: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  success: boolean;
  translatedText?: string;
  error?: string;
}

export type Language = 'fr' | 'en' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}