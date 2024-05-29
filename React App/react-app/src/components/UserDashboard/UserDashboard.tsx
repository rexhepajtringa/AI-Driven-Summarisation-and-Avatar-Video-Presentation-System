import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

// Define TypeScript interfaces for your data
interface Summary {
  id: number;
  title: string;
  content: string;
  contentType: string;
  contentUrl: string;
  createdAt: string; // or Date depending on what your backend sends
}

interface Video {
  id: number;
  title: string;
  contentType: string;
  contentUrl: string;
  createdAt: string; // or Date
}

const DashboardPage = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]); // Explicitly type the state
  const [videos, setVideos] = useState<Video[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  // Function to fetch content from the API using fetch
  const fetchContent = async (contentType: "TEXT" | "VIDEO") => {
    if (!token || !userId) {
      console.error("Authentication required.");
      return;
    }

    const url = `http://localhost:8765/USER-MANAGEMENT-SERVICE/content/user/${userId}/type/${contentType}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(`Data for ${contentType}:`, data);
      if (Array.isArray(data)) {
        if (contentType === "TEXT") {
          setSummaries(data);
        } else if (contentType === "VIDEO") {
          setVideos(data);
        }
      } else {
        console.error("Received data is not an array:", data);
      }
    } catch (error) {
      console.error(`Error fetching ${contentType} content:`, error);
    }
  };

  // Function to fetch the summary text and open the modal using fetch
  const handleViewSummary = async (contentId: number) => {
    if (!token) {
      console.error("Authentication required.");
      return;
    }

    const url = `http://localhost:8765/USER-MANAGEMENT-SERVICE/content/content/${contentId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textContent = await response.text();

      setModalContent(textContent); // Set the content in state
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    fetchContent("TEXT").catch(console.error);
    fetchContent("VIDEO").catch(console.error);
  }, [userId, token]);

  useEffect(() => {
    fetchContent("TEXT").catch(console.error);
    fetchContent("VIDEO").catch(console.error);
  }, [userId, token]);

  return (
    <Container>
      <h1>Welcome back, User!</h1>

      <h2>Your Saved Summaries</h2>
      <Row xs={1} md={2} className="g-4">
        {summaries?.map((summary, index) => (
          <Col key={index}>
            <Card>
              <Card.Body>
                <Card.Title>{summary.title}</Card.Title>
                <Button
                  variant="primary"
                  onClick={() => handleViewSummary(summary.id)}>
                  View Summary
                </Button>{" "}
                <Card.Footer>
                  <small className="text-muted">
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h2 className="mt-4">Your Saved Videos</h2>
      <Row xs={1} md={2} className="g-4">
        {videos?.map((video, index) => (
          <Col key={index}>
            <Card>
              <Card.Body>
                <Card.Title>{video.title}</Card.Title>
                <div
                  style={{
                    width: "100%",
                    height: "0",
                    paddingBottom: "56.25%",
                    position: "relative",
                  }}>
                  <iframe
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                    }}
                    src={video.contentUrl}
                    frameBorder="0"
                    allowFullScreen></iframe>
                </div>
                <Button variant="primary">Watch Video</Button>
                <Card.Footer>
                  <small className="text-muted">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for displaying summary content */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Summary Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            readOnly
            value={modalContent}
            className="w-100"
            style={{ height: "200px" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DashboardPage;
