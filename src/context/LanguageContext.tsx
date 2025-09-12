'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enMessages from '../../messages/en.json';
import idMessages from '../../messages/id.json';
import esMessages from '../../messages/es.json';
import zhMessages from '../../messages/zh.json';

const messagesData: any = {
  en: enMessages,
  id: idMessages,
  es: esMessages,
  zh: zhMessages,
};

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  messages: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState(messagesData.en);

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && messagesData[storedLocale]) {
      setLocale(storedLocale);
      setMessages(messagesData[storedLocale]);
    }
  }, []);

  const handleSetLocale = (newLocale: string) => {
    if (messagesData[newLocale]) {
      localStorage.setItem('locale', newLocale);
      setLocale(newLocale);
      setMessages(messagesData[newLocale]);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, messages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslations(namespace: string) {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  
  const { messages } = context;

  return (key: string) => {
    const translation = messages[namespace]?.[key];
    return translation || `${namespace}.${key}`;
  };
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}