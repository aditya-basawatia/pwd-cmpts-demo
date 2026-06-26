import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import hi from './hi';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi } },
  lng: localStorage.getItem('cmpts-lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function setLanguage(lang: 'en' | 'hi') {
  localStorage.setItem('cmpts-lang', lang);
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
}

export default i18n;
