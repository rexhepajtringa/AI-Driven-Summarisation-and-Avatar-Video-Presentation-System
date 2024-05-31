import { useState, useEffect } from "react";
import { ListGroup, Tab, Nav, Modal, Card } from "react-bootstrap";
import Cookies from "js-cookie";
import styles from "./UserDashboard.module.css"; 
import { useGlobalContent } from "../Utils/GlobalContentContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; 
import config from "config";

interface Content {
  id: number;
  title: string;
  content: string;
  contentType: "TEXT" | "AUDIO" | "VIDEO";
  contentUrl: string;
  createdAt: string;
}

const UserDashboard = () => {
  const [summaries, setSummaries] = useState<Content[]>([]);
  const [audios, setAudios] = useState<Content[]>([]);
  const [videos, setVideos] = useState<Content[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalContentType, setModalContentType] = useState("");
  const navigate = useNavigate(); 

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
    const url = `${config.API_GATEWAY_URL}/USER-MANAGEMENT-SERVICE/content/user/${userId}/type/${contentType}`;
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
    const url = `${config.API_GATEWAY_URL}/USER-MANAGEMENT-SERVICE/content/content/${content.id}`;
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
        globalContent.updateText(textContent); 
      } else if (
        content.contentType === "AUDIO" ||
        content.contentType === "VIDEO"
      ) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setModalContent(url);
        setModalContentType(content.contentType);
        globalContent.updateAudio(url);
      } else {
        throw new Error("Unsupported content type");
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleDeleteContent = async (
    content: Content,
    contentType: "TEXT" | "AUDIO" | "VIDEO"
  ) => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    if (!token || !userId) {
      console.error("No token or userId found.");
      return;
    }

    try {
      const url = `${config.API_GATEWAY_URL}/USER-MANAGEMENT-SERVICE/content/user/${userId}/content/${content.id}`;
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const request = new Request(url, options);
      const response = await fetch(request);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Forbidden: You don't have permission to delete this content."
          );
        }
        if (response.status === 404) {
          throw new Error(
            "Not Found: The content you're trying to delete doesn't exist."
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (contentType === "TEXT") {
        setSummaries((prev) => prev.filter((item) => item.id !== content.id));
      } else if (contentType === "AUDIO") {
        setAudios((prev) => prev.filter((item) => item.id !== content.id));
      } else if (contentType === "VIDEO") {
        setVideos((prev) => prev.filter((item) => item.id !== content.id));
      }
    } catch (error) {
      console.error("Error deleting content:", error);
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
          <div className={styles.buttonGroup}>
            <button
              className={`btn btn-primary ${styles.btnPrimary}`}
              onClick={() => handleViewContent(content)}>
              View
            </button>
            <button
              className={`btn btn-danger ${styles.btnDanger}`}
              onClick={() => handleDeleteContent(content, content.contentType)}>
              <FaTrash />
            </button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  type ContentType = "TEXT" | "AUDIO" | "VIDEO";

  const handleUseContent = (type: ContentType, contentData: string) => {
    setContent((prevState) => ({
      ...prevState,
      [type.toLowerCase()]: contentData,
    }));
    navigate("/"); 
  };

  const renderUseButton = (contentType: ContentType) => {
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
          {modalContentType &&
            modalContentType !== "" &&
            renderUseButton(modalContentType as ContentType)}

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

export default UserDashboard;
