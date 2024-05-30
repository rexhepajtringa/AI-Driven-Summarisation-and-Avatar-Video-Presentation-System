import React, { useState, useEffect, useRef } from "react";
import styles from "./VoiceSelector.module.css"; // Make sure to use CSS modules for scoping
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import { AudioPlayer } from "react-audio-play"; // Make sure to import AudioPlayer
import Cookies from "js-cookie"; // Import js-cookie
import { Button, Form, Col, Row, Spinner } from "react-bootstrap";
import { useGlobalContent } from "../Utils/GlobalContentContext";

interface Voice {
  voice_id: string;
  name: string;
  description: string;
  preview_url: string;
}

const VoiceSelector: React.FC = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null); // State to track the selected voice ID
  const audioRefs = useRef<{ [url: string]: HTMLAudioElement }>({});
  const voicesPerPage = 5;
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioKey, setAudioKey] = useState<number>(0); // State to force AudioPlayer re-render
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to track loading status

  const [audioTitle, setAudioTitle] = useState("");
  const globalContext = useGlobalContent();

  if (!globalContext) {
    throw new Error(
      "useGlobalContent must be used within a GlobalContentProvider"
    );
  }

  const { content } = globalContext;
  const summaryText = content.text;

  useEffect(() => {
    if (content.audio) {
      setAudioSrc(content.audio);
    }
  }, [content.audio]);

  useEffect(() => {
    const fetchVoices = async () => {
      const response = await fetch(
        "http://localhost:8765/TEXT-TO-VOICE-SERVICE/voices"
      );
      const data = await response.json();
      setVoices(data);
      // Initialize audio elements for all voices
      data.forEach((voice: Voice) => {
        const audio = new Audio(voice.preview_url);
        audio.addEventListener("ended", () => setCurrentPlaying(null));
        audioRefs.current[voice.preview_url] = audio;
      });
    };

    fetchVoices();

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.removeEventListener("ended", () => setCurrentPlaying(null));
      });
    };
  }, []);

  const handleVoiceSelection = (voiceId: string) => {
    if (!summaryText) {
      alert("Please enter or generate summary text first.");
      return;
    }

    setIsLoading(true); // Start loading

    const postData = {
      voice_id: voiceId,
      text: summaryText,
    };

    fetch("http://localhost:8765/TEXT-TO-VOICE-SERVICE/synthesize-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const audioURL = URL.createObjectURL(blob);
        setAudioSrc(audioURL);
        setAudioKey((prevKey) => prevKey + 1); // Force re-render of AudioPlayer
        globalContext.updateAudio(audioURL);
      })
      .catch((error) => {
        console.error("Error during text-to-speech processing:", error);
      })
      .finally(() => {
        setIsLoading(false); // End loading
      });
  };

  const totalPages = Math.ceil(voices.length / voicesPerPage);
  const indexOfLastVoice = currentPage * voicesPerPage;
  const indexOfFirstVoice = indexOfLastVoice - voicesPerPage;
  const currentVoices = voices.slice(indexOfFirstVoice, indexOfLastVoice);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const togglePlay = (voice: Voice) => {
    const currentlyPlayingAudio = currentPlaying
      ? audioRefs.current[currentPlaying]
      : null;
    const newAudio = audioRefs.current[voice.preview_url];

    if (currentPlaying === voice.preview_url) {
      newAudio.pause();
      setCurrentPlaying(null);
    } else {
      if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
      }
      newAudio.play();
      setCurrentPlaying(voice.preview_url);
    }
  };

  const selectVoice = (voice: Voice) => {
    setSelectedVoiceId(voice.voice_id);
  };

  const saveAudioContent = async () => {
    if (!audioTitle.trim()) {
      alert("Please provide a title for the audio.");
      return;
    }

    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    if (!token || !userId) {
      alert("Authentication required.");
      return;
    }

    if (audioSrc) {
      const audioBlob = await fetch(audioSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.mp3");
      formData.append("title", audioTitle);
      formData.append("contentType", "AUDIO");

      try {
        const response = await fetch(
          `http://localhost:8765/USER-MANAGEMENT-SERVICE/content/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
            credentials: "omit",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save the audio content.");
        }

        alert("Audio content saved successfully!");
        setAudioTitle(""); // Clear title after saving
      } catch (error) {
        console.error("Error saving audio content:", error);
      }
    } else {
      console.error("Audio source is null");
    }
  };

  return (
    <div className={styles.paperParent}>
      <div
        className={styles.paper}
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}>
        <div className={styles.header}>Choose a Voice</div>
        <div className={styles.voiceSelector}>
          {currentVoices.map((voice, index) => (
            <div
              className={`${styles.voiceCard} ${
                selectedVoiceId === voice.voice_id
                  ? styles.selectedVoiceCard
                  : ""
              }`}
              key={voice.voice_id}
              onClick={() => selectVoice(voice)}
              style={{
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}>
              <div
                className={`${styles.colorBlock} ${
                  styles["colorBlock" + ((index % 3) + 1)]
                }`}>
                <div className={styles.playpause}>
                  <input
                    type="checkbox"
                    value="None"
                    id={`playpause${index}`}
                    name="check"
                    checked={currentPlaying === voice.preview_url}
                    onChange={() => togglePlay(voice)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={`playpause${index}`} tabIndex={1}></label>
                </div>
              </div>
              <div className={styles.voiceInfo}>
                <p className={styles.voiceName}>{voice.name}</p>
                <p className={styles.voiceUrl}>{voice.description}</p>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}>
                    <button
                      onClick={() => handlePageChange(page)}
                      className="page-link">
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        )}
        <Col md={12} className="d-flex justify-content-center">
          <Button
            variant="primary"
            type="button"
            onClick={() =>
              selectedVoiceId && handleVoiceSelection(selectedVoiceId)
            }>
            Generate Speech
          </Button>
        </Col>
        {isLoading && (
          <Row className="justify-content-center mt-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Row>
        )}
        {audioSrc && (
          <Row className="justify-content-center">
            <Col md={12} className="d-flex flex-column align-items-center">
              <AudioPlayer
                key={audioKey} // Use audioKey to force re-render
                style={{ margin: "auto", padding: "2em" }}
                className={styles.customstyle}
                src={audioSrc} // Use the audioSrc state for the source
              />
              <Form.Control
                type="text"
                placeholder="Enter title for the audio"
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                className="my-3 w-50"
              />
              <Button
                variant="primary"
                onClick={saveAudioContent}
                className="my-2">
                Save Audio
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = audioSrc;
                  link.setAttribute(
                    "download",
                    audioTitle || "downloaded_audio.mp3"
                  );
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="my-2">
                Download Audio
              </Button>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default VoiceSelector;
