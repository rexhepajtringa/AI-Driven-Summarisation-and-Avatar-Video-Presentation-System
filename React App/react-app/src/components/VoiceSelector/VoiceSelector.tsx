import React, { useState, useEffect, useRef } from "react";
import styles from "./VoiceSelector.module.css"; // Make sure to use CSS modules for scoping
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import { useText } from "../../Context";
import { AudioPlayer } from "react-audio-play"; // Make sure to import AudioPlayer
import Cookies from "js-cookie"; // Import js-cookie
import { Button, Form, Col, Row } from "react-bootstrap";
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
  const { setGlobalAudio } = useText();

  const { summaryText } = useText(); // Access the summaryText from the context
  const [audioTitle, setAudioTitle] = useState("");
  const globalContext = useGlobalContent();

  // Check if globalContext is not null
  if (!globalContext) {
    throw new Error(
      "useGlobalContent must be used within a GlobalContentProvider"
    );
  }

  // Now TypeScript knows globalContext is not null
  const { content, setContent } = globalContext;

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
    // If there's no summaryText, we can't proceed
    if (!summaryText) {
      alert("Please enter or generate summary text first.");
      return;
    }

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
        setAudioSrc(audioURL); // This will now trigger the rendering of the AudioPlayer
        setGlobalAudio(audioURL);
        // Set the audio source state
      })
      .catch((error) => {
        console.error("Error during text-to-speech processing:", error);
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
    // Add any additional logic here if needed, such as preparing for a POST request
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

    // Convert the audio source to a Blob and treat it as a file
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
              key={voice.voice_id} // Updated to use voice_id for key
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
                    onClick={(e) => e.stopPropagation()} // Prevent triggering multiple times
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
        {audioSrc && (
          <Row className="justify-content-center">
            <Col md={12} className="d-flex flex-column align-items-center">
              <AudioPlayer
                style={{ margin: "auto", padding: "2em" }}
                className={styles.customstyle}
                src={audioSrc} // Use the audioSrc state for the source
              />
              <Form.Control
                type="text"
                placeholder="Enter title for the audio"
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                className="my-3 w-50" // Adjust the width as needed
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
                  // Create a link and click it to download the audio
                  const link = document.createElement("a");
                  link.href = audioSrc;
                  link.setAttribute(
                    "download",
                    audioTitle || "downloaded_audio.mp3"
                  ); // Use the title or a default filename
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
