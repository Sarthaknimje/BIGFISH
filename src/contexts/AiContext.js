'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { aiService } from '../services/aiService';

const AiContext = createContext();

export function AiProvider({ children }) {
  const [isAiReady, setIsAiReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAi = async () => {
      try {
        const isValid = await aiService.verifyApiKey();
        setIsAiReady(isValid);
        if (!isValid) {
          setError('AI service initialization failed');
        }
      } catch (err) {
        setError(err.message);
        setIsAiReady(false);
      }
    };

    initializeAi();
  }, []);

  return (
    <AiContext.Provider value={{ isAiReady, error }}>
      {children}
    </AiContext.Provider>
  );
}

export const useAi = () => useContext(AiContext); 