import React, { useState, useEffect, useRef } from "react";
import styles from "./VoiceSelector.module.css"; // Make sure to use CSS modules for scoping
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import { useText } from "../../Context";
import Col from "react-bootstrap/esm/Col";
import { Button } from "react-bootstrap";

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
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const { summaryText } = useText(); // Access the summaryText from the context

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
        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = audioURL;
          audioPlayerRef.current.play();
        }
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

        <audio ref={audioPlayerRef} controls style={{ width: "100%" }}></audio>
      </div>
    </div>
  );
};

export default VoiceSelector;
