import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContentState {
  text: string;
  audio: string;
  video: string;
}

interface GlobalContentContextProps {
  content: ContentState;
  setContent: React.Dispatch<React.SetStateAction<ContentState>>;
  resetContent: () => void;
}

// Create a context with a default value
const GlobalContentContext = createContext<GlobalContentContextProps | null>(
  null
);

// Export the hook for using this context
export const useGlobalContent = () => {
  const context = useContext(GlobalContentContext);
  if (!context) {
    throw new Error(
      "useGlobalContent must be used within a GlobalContentProvider"
    );
  }
  return context;
};

// Type the children prop explicitly
interface GlobalContentProviderProps {
  children: ReactNode;
}

export const GlobalContentProvider: React.FC<GlobalContentProviderProps> = ({
  children,
}) => {
  const [content, setContent] = useState<ContentState>({
    text: "",
    audio: "",
    video: "",
  });

  const resetContent = () => {
    setContent({ text: "", audio: "", video: "" });
  };

  return (
    <GlobalContentContext.Provider
      value={{ content, setContent, resetContent }}>
      {children}
    </GlobalContentContext.Provider>
  );
};
