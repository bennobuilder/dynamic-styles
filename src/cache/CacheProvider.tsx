import React from 'react';
import { EmotionCache } from '@emotion/cache';

interface CacheProviderProps {
  value: EmotionCache;
  children: React.ReactNode;
}

export const CacheContext = React.createContext<EmotionCache | null>(null);

const CacheProvider: React.FC<CacheProviderProps> = (props) => {
  const { children, value } = props;
  return (
    <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
  );
};

export default CacheProvider;
