import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import styles from "./VideoGenerator.module.css";
import { useText } from "../../Context";
import ReactPlayer from "react-player";
import Cookies from "js-cookie";
import { useGlobalContent } from "../Utils/GlobalContentContext"; // Adjust the import path as necessary

const VideoGenerator = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const defaultImages = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",
    "https://images.generated.photos/EO4QtL4qFG9OHQSmDcSvkYQi6D4F5a2fyz_9SXTpOyw/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/OTU1NDQ3LmpwZw.jpg",
    "https://images.generated.photos/HMGgG7_ypCbRHxMMmoStLE7lSWj72-zYhcbENrLhh9Y/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NjkxMDY2LmpwZw.jpg",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80",
    "https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  const { audio } = useText();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  // Access the global content state
  const globalContext = useGlobalContent();

  // Check if globalContext is not null
  if (!globalContext) {
    throw new Error(
      "useGlobalContent must be used within a GlobalContentProvider"
    );
  }

  // Now TypeScript knows globalContext is not null
  const { content } = globalContext;

  // Set the local videoUrl state when the global video state changes
  useEffect(() => {
    if (content.video) {
      setVideoUrl(content.video);
    }
  }, [content.video]);

  const handleImageUpload = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage("");
    }
  };

  const uploadAvatarVideo = async () => {
    if (!selectedImage || !audio) {
      alert("Please select an image and generate audio first.");
      return;
    }

    const audioBlob = await urlToBlob(audio);

    const imageBlob = await urlToBlob(selectedImage);

    const formData = new FormData();
    formData.append("image", imageBlob, "image.jpg");
    formData.append("audio", audioBlob, "audio.mp3");

    fetch("http://localhost:8765/TEXT-TO-VOICE-SERVICE/lip-sync", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.output_video_url) {
          setVideoUrl(data.output_video_url);
        } else {
          throw new Error("No video URL in response");
          console.log(data);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const saveVideoContent = async () => {
    if (!videoTitle.trim()) {
      alert("Please provide a title for the video.");
      return;
    }

    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    if (!token || !userId) {
      alert("Authentication required.");
      return;
    }

    const videoBlob = await fetch(videoUrl).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", videoBlob, "video.mp4");
    formData.append("title", videoTitle);
    formData.append("contentType", "VIDEO");

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
        throw new Error("Failed to save the video content.");
      }

      alert("Video content saved successfully!");
      setVideoTitle(""); // Clear title after saving
    } catch (error) {
      console.error("Error saving video content:", error);
    }
  };

  const urlToBlob = async (url) => {
    if (url.startsWith("data:")) {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    } else {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    }
  };

  return (
    <Container fluid style={{ width: "82%" }}>
      <Row>
        <Col>
          <Card>
            <Card.Body
              style={{
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                borderRadius: "10px",
                backgroundColor:
                  "rgba(255, 255, 255, 0.5)" /* Semi-transparent white background */,
                padding: "20px" /* Adjust padding as needed */,
                // Other styles you want to apply
              }}
              className={`${
                videoUrl ? "videoContainerExpanded" : "videoContainer"
              }`}>
              <Card.Title className="text-center">
                Generate Avatar Video
              </Card.Title>
              <Card.Text className="text-center">
                Choose or input an image and generate video
              </Card.Text>
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex flex-row align-items-center justify-content-center flex-wrap">
                  {defaultImages.map((image, index) => (
                    <div
                      key={index}
                      className={`m-2 ${
                        selectedImage === image ? styles.selectedImage : ""
                      }`}
                      onClick={() => setSelectedImage(image)}
                      style={{ cursor: "pointer" }}>
                      <img
                        src={image}
                        alt={`Face ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Or upload your own:</Form.Label>
                  <Form.Control type="file" onChange={handleImageUpload} />
                </Form.Group>
                {selectedImage && (
                  <div className="mt-3">
                    <img
                      src={selectedImage}
                      alt="Selected or Uploaded"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={uploadAvatarVideo}>
                  Generate Video
                </Button>
                {videoUrl && (
                  <>
                    <ReactPlayer url={videoUrl} controls={true} width="100%" />
                    <Row className="justify-content-md-center">
                      <Form className="w-100">
                        <Form.Group controlId="videoTitle">
                          <Form.Label>Video Title</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter video title"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                          />
                        </Form.Group>
                        <div className="d-flex justify-content-center mt-3">
                          <Button variant="primary" onClick={saveVideoContent}>
                            Save Video
                          </Button>
                        </div>
                        {videoUrl && (
                          <div className="d-flex justify-content-center mt-3">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                // Ensure the link has the download attribute to download the file
                                const a = document.createElement("a");
                                a.href = videoUrl;
                                a.download =
                                  videoTitle || "downloadedVideo.mp4"; // Default filename if title isn't set
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }}>
                              Download Video
                            </Button>
                          </div>
                        )}
                      </Form>
                    </Row>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoGenerator;
