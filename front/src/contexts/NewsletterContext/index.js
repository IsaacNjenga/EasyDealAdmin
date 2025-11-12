import { createContext, useContext, useState } from "react";

const NewsletterContext = createContext();

export function useNewsletter() {
  return useContext(NewsletterContext);
}

export function NewsletterProvider({ children }) {
  const [draft, setDraft] = useState({});

  const value = {};
  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
}
