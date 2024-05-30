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
  updateText: (text: string) => void; // Add this method
  updateAudio: (audio: string) => void; // Add this method
  updateVideo: (video: string) => void; // Add this method
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

  const updateText = (text: string) => {
    setContent((prevState) => ({ ...prevState, text }));
  };

  const updateAudio = (audio: string) => {
    setContent((prevState) => ({ ...prevState, audio }));
  };

  const updateVideo = (video: string) => {
    setContent((prevState) => ({ ...prevState, video }));
  };

  // const resetContent = () => {
  //   setContent({ text: "", audio: "", video: "" });
  // };

  return (
    <GlobalContentContext.Provider
      value={{
        content,
        setContent,
        resetContent,
        updateText,
        updateAudio,
        updateVideo,
      }}>
      {children}
    </GlobalContentContext.Provider>
  );
};
