import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

// 初始化 i18n
const initializeI18n = async () => {
  try {
    // 从后端获取默认语言设置
    const response = await fetch('/api/v1/config');
    const config = await response.json();
    const defaultLanguage = config.default_language || 'en';

    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          en: {
            translation: enTranslation,
          },
          zh: {
            translation: zhTranslation,
          },
        },
        fallbackLng: 'en',
        lng: defaultLanguage, // 使用从后端获取的默认语言
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
        },
        interpolation: {
          escapeValue: false,
        },
      });
  } catch (error) {
    console.error('Failed to fetch default language:', error);
    // 如果获取失败，使用默认配置初始化
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          en: {
            translation: enTranslation,
          },
          zh: {
            translation: zhTranslation,
          },
        },
        fallbackLng: 'en',
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
        },
        interpolation: {
          escapeValue: false,
        },
      });
  }
};

// 执行初始化
initializeI18n();

export default i18n;