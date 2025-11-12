import { createContext, useContext, useEffect, useState } from "react";

const NewsletterContext = createContext();

export function useNewsletter() {
  return useContext(NewsletterContext);
}

export function NewsletterProvider({ children }) {
  const [draft, setDraft] = useState({
    subject: "",
    heading: "",
    subheading: "",
    ctaText: "",
    selectedProducts: [],
  });

  useEffect(() => {
    const savedDraft = JSON.parse(localStorage.getItem("draft"));
    if (savedDraft) {
      try {
        setDraft(JSON.parse(savedDraft));
      } catch (error) {
        console.error("Failed to parse draft", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("draft", JSON.stringify(draft));
  }, [draft]);

  const clearDraft = () => {
    setDraft({
      subject: "",
      heading: "",
      subheading: "",
      ctaText: "",
      selectedProducts: [],
    });
    localStorage.removeItem("draft");
  };

  const value = { draft, setDraft, clearDraft };
  
  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
}
