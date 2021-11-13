import React from 'react';
import { EmotionCache } from '@emotion/cache';

interface CacheProviderProps {
  value: EmotionCache;
  children: React.ReactNode;
}

export const cacheContext = React.createContext<EmotionCache | null>(null);

const CacheProvider: React.FC<CacheProviderProps> = (props) => {
  const { children, value } = props;
  return (
    <cacheContext.Provider value={value}>{children}</cacheContext.Provider>
  );
};

export default CacheProvider;
