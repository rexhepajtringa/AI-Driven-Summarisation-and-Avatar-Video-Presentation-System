import { useState, useEffect } from "react";
import { ListGroup, Tab, Nav, Modal, Card } from "react-bootstrap";
import Cookies from "js-cookie";
import styles from "./ContentTabs.module.css"; // Make sure the path is correct
import { useGlobalContent } from "../Utils/GlobalContentContext";
import { useNavigate } from "react-router-dom";

interface Content {
  id: number;
  title: string;
  content: string;
  contentType: "TEXT" | "AUDIO" | "VIDEO";
  contentUrl: string;
  createdAt: string;
}

const ContentTabs: React.FC = () => {
  const [summaries, setSummaries] = useState<Content[]>([]);
  const [audios, setAudios] = useState<Content[]>([]);
  const [videos, setVideos] = useState<Content[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [modalContentType, setModalContentType] = useState<
    "TEXT" | "AUDIO" | "VIDEO" | ""
  >("");
  const navigate = useNavigate(); // Hook to redirect

  const globalContent = useGlobalContent();

  if (!globalContent) {
    throw new Error(
      "useGlobalContent must be used within a GlobalContentProvider"
    );
  }

  const { setContent } = globalContent;

  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  useEffect(() => {
    fetchContent("TEXT");
    fetchContent("AUDIO");
    fetchContent("VIDEO");
  }, []);

  const fetchContent = async (contentType: "TEXT" | "AUDIO" | "VIDEO") => {
    const url = `http://localhost:8765/USER-MANAGEMENT-SERVICE/content/user/${userId}/type/${contentType}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Content[] = await response.json();
      if (Array.isArray(data)) {
        if (contentType === "TEXT") setSummaries(data);
        if (contentType === "AUDIO") setAudios(data);
        if (contentType === "VIDEO") setVideos(data);
      }
    } catch (error) {
      console.error(`Error fetching ${contentType} content:`, error);
    }
  };

  const handleViewContent = async (content: Content) => {
    const url = `http://localhost:8765/USER-MANAGEMENT-SERVICE/content/content/${content.id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (content.contentType === "TEXT") {
        const textContent = await response.text();
        setModalContent(textContent);
        setModalContentType("TEXT");
      } else if (
        content.contentType === "AUDIO" ||
        content.contentType === "VIDEO"
      ) {
        const blob = await response.blob();
        setModalContent(URL.createObjectURL(blob));
        setModalContentType(content.contentType);
      } else {
        throw new Error("Unsupported content type");
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const renderContentList = (contentArray: Content[]) => (
    <ListGroup className={`${styles.listGroup} list-group-flush`}>
      {contentArray.map((content) => (
        <ListGroup.Item key={content.id} className={`${styles.listGroupItem}`}>
          <div>
            <h5 className={styles.contentTitle}>{content.title}</h5>
            <p className={styles.contentDate}>
              Created At: {new Date(content.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            className={`btn btn-primary ${styles.btnPrimary}`}
            onClick={() => handleViewContent(content)}>
            View
          </button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  const handleUseContent = (
    type: "TEXT" | "AUDIO" | "VIDEO",
    contentData: string
  ) => {
    setContent((prevState) => ({
      ...prevState,
      [type.toLowerCase()]: contentData,
    }));
    navigate("/"); // Redirect to the home page
  };

  // Render the button dynamically based on content type
  const renderUseButton = (contentType: "TEXT" | "AUDIO" | "VIDEO" | "") => {
    if (!contentType) return null; // Ensure contentType is not an empty string
    let buttonText = "";
    switch (contentType) {
      case "TEXT":
        buttonText = "Use Summary";
        break;
      case "AUDIO":
        buttonText = "Use Audio";
        break;
      case "VIDEO":
        buttonText = "Use Video";
        break;
      default:
        return null;
    }

    return (
      <button
        className={`${styles.btn} ${styles.btnSuccess}`}
        onClick={() => handleUseContent(contentType, modalContent)}>
        {buttonText}
      </button>
    );
  };

  return (
    <>
      <Card className={styles.cardContainer}>
        <Tab.Container id="content-tabs" defaultActiveKey="summaries">
          <Card.Header className={styles.cardHeader}>
            <Nav variant="tabs" className={styles.navTabs}>
              <Nav.Item>
                <Nav.Link eventKey="summaries" className={styles.navLink}>
                  Saved Summaries
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="audios" className={styles.navLink}>
                  Saved Audios
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="videos" className={styles.navLink}>
                  Saved Videos
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body className={styles.cardBody}>
            <Tab.Content>
              <Tab.Pane eventKey="summaries">
                {renderContentList(summaries)}
              </Tab.Pane>
              <Tab.Pane eventKey="audios">{renderContentList(audios)}</Tab.Pane>
              <Tab.Pane eventKey="videos">{renderContentList(videos)}</Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Tab.Container>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className={styles.modal}>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            Content Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {modalContent &&
            (modalContentType === "TEXT" ? (
              <p>{modalContent}</p>
            ) : modalContentType === "AUDIO" ? (
              <audio controls src={modalContent} style={{ width: "100%" }} />
            ) : modalContentType === "VIDEO" ? (
              <video controls src={modalContent} style={{ width: "100%" }} />
            ) : null)}{" "}
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          {renderUseButton(modalContentType)}

          {modalContent && (
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => {
                const link = document.createElement("a");
                link.href = modalContent;
                if (modalContentType === "TEXT") {
                  link.download = "download.txt";
                } else if (modalContentType === "AUDIO") {
                  link.download = "download.mp3";
                } else if (modalContentType === "VIDEO") {
                  link.download = "download.mp4";
                }
                link.click();
              }}>
              Download
            </button>
          )}
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ContentTabs;
