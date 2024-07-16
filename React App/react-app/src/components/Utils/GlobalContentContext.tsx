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
  updateText: (text: string) => void;
  updateAudio: (audio: string) => void; 
  updateVideo: (video: string) => void;
}


const GlobalContentContext = createContext<GlobalContentContextProps | null>(
  null
);

export const useGlobalContent = () => {
  const context = useContext(GlobalContentContext);
  if (!context) {
    throw new Error(
      "useGlobalContent must be used within a GlobalContentProvider"
    );
  }
  return context;
};

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
