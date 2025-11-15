import React, { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Effect to re-read from localStorage when the key changes (e.g., user switch)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // If the new key (new user) has no data, reset to the initial value.
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.log("Error reading from localStorage on key change", error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Effect to save to localStorage whenever the value or key changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.log("Error writing to localStorage", error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
