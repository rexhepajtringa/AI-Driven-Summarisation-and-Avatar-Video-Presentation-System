import React, { createContext, useContext, useState, ReactNode } from "react";

interface ITextContext {
  summaryText: string;
  setSummaryText: (text: string) => void;
  audio: string;
  setGlobalAudio: (src: string) => void;
}

const defaultState: ITextContext = {
  summaryText: "",
  setSummaryText: () => {},
  audio: "",
  setGlobalAudio: () => {},
};

const TextContext = createContext<ITextContext>(defaultState);

export const useText = () => useContext(TextContext);

interface Props {
  children: ReactNode;
}

export const TextProvider: React.FC<Props> = ({ children }) => {
  const [summaryText, setSummaryText] = useState("");
  const [audio, setGlobalAudio] = useState("");

  return (
    <TextContext.Provider
      value={{ summaryText, setSummaryText, audio, setGlobalAudio }}>
      {children}
    </TextContext.Provider>
  );
};
