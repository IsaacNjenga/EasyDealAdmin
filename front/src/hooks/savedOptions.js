import { useState, useEffect } from "react";

function useSavedOptions(key) {
  const [savedOptions, setSavedOptions] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem(key);
    if (data) setSavedOptions(JSON.parse(data));
  }, [key]);

  const addOptions = (newValues) => {
    const updated = Array.from(new Set([...savedOptions, ...newValues]));
    setSavedOptions(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return { savedOptions, addOptions };
}

export default useSavedOptions;
