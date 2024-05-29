import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./txtsum.css";
import { useGlobalContent } from "../Utils/GlobalContentContext";
import { useText } from "../../Context";
import Cookies from "js-cookie"; // Import js-cookie

interface RangeExampleProps {
  summaryLength: string;
  setSummaryLength: (length: string) => void;
}

const RangeExample: React.FC<RangeExampleProps> = ({
  summaryLength,
  setSummaryLength,
}) => {
  const summaryLengthOptions = ["very short", "short", "medium", "long"];

  // Convert the descriptive value back to slider's numeric value for the UI
  const sliderValue = summaryLengthOptions.indexOf(summaryLength);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert the slider's numeric value back to your descriptive value
    const newValue = summaryLengthOptions[parseInt(e.target.value)];
    setSummaryLength(newValue);
  };

  return (
    <div>
      <Form.Label>Length of Summary</Form.Label>
      <Form.Range
        min={0} // Minimum slider value
        max={3} // Maximum slider value (for 4 positions)
        value={sliderValue} // Current slider position
        onChange={handleSliderChange}
        className="custom-slider"
      />
      <p>Summary Will Be: {summaryLength}</p>
    </div>
  );
};

const TextSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [includeReferences, setIncludeReferences] = useState(false);
  const [summaryTone, setSummaryTone] = useState("Neutral");
  const [title, setTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const globalContext = useGlobalContent();

  // Check if globalContext is not null
  if (!globalContext) {
    throw new Error(
      "useGlobalContent must be used within a GlobalContentProvider"
    );
  }

  // Now TypeScript knows globalContext is not null
  const { content } = globalContext;

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummaryText(e.target.value);
    setGlobalSummaryText(e.target.value);
  };

  useEffect(() => {
    if (content.text) {
      // Set your local state to the content from context
      setSummaryText(content.text);
    }
  }, [content.text]);

  const handleFileChange = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:8765/DOCUMENT-HANDLING-SERVICE/api/document/uploadPdf",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
        const data = await response.text(); // Use `.text()` instead of `.json()`
        setInputText(data); // Directly set the text without assuming JSON structure
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const sumTextArea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${Math.min(textArea.scrollHeight, 330)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    const textArea = sumTextArea.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${Math.min(textArea.scrollHeight, 600)}px`;
    }
  }, [summaryText]);

  const { setSummaryText: setGlobalSummaryText } = useText();

  const handleSummarize = async () => {
    if (inputText) {
      const payload = {
        text: inputText,
        tone: summaryTone,
        length: summaryLength,
        includeReferences: includeReferences,
      };

      try {
        const response = await fetch(
          "http://localhost:8765/SUMMARY-SERVICE/api/summarize",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Server response wasn't OK");
        }

        const summary = await response.text();
        setSummaryText(summary);
        setGlobalSummaryText(summary);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please input text before summarizing");
    }
  };

  const saveSummaryContent = async () => {
    if (!summaryText.trim() || !title.trim()) {
      alert("Please provide both a title and a summary before saving.");
      return;
    }

    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    if (!token || !userId) {
      alert("Authentication required");
      return;
    }

    // Convert the summary text to a Blob and treat it as a file
    const blob = new Blob([summaryText], { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", blob, "summary.txt");
    formData.append("title", title);
    formData.append("contentType", "TEXT");

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
        throw new Error("Could not save the summary content.");
      }

      setSaveStatus("Summary saved successfully!");
      setTitle(""); // Optionally clear title after saving
      setSummaryText(""); // Optionally clear summaryText as well
    } catch (error) {
      console.error("Error:", error);
      setSaveStatus("Failed to save summary.");
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body
              style={{
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}>
              <Card.Title className="text-center">
                Input text to summarize
              </Card.Title>
              <Form>
                <Form.Group
                  controlId="formFile"
                  className="mb-3"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}>
                  <Form.Label>Drag & Drop File or Click to Upload</Form.Label>
                  <Form.Control type="file" onChange={handleFileUpload} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="inputText">
                  <Form.Label className="text-center d-block">or</Form.Label>
                  <Form.Control
                    as="textarea"
                    ref={textAreaRef}
                    rows={3}
                    style={{ backgroundColor: "#ededed", minHeight: "200px" }}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <RangeExample
                      summaryLength={summaryLength}
                      setSummaryLength={setSummaryLength}
                    />
                  </Col>
                  <Col
                    md={4}
                    className="d-flex align-items-center justify-content-center">
                    <Form.Check
                      type="checkbox"
                      label="Include References"
                      checked={includeReferences}
                      onChange={(e) => setIncludeReferences(e.target.checked)}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="summaryTone">
                      <Form.Label>Summary Tone</Form.Label>
                      <Form.Select
                        aria-label="Summary Tone Select"
                        value={summaryTone}
                        onChange={(e) => setSummaryTone(e.target.value)}>
                        <option value="Neutral">Neutral</option>
                        <option value="Professional">Professional</option>
                        <option value="Casual">Casual</option>
                        <option value="Enthusiastic">Enthusiastic</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="d-flex justify-content-center">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleSummarize}>
                      Summarize
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body
              style={{
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}>
              <Card.Title>Summary Output</Card.Title>
              <Form.Group controlId="summaryText">
                <Form.Control
                  as="textarea"
                  rows={3}
                  ref={sumTextArea}
                  value={summaryText}
                  style={{ minHeight: "355px", backgroundColor: "#ededed" }}
                  onChange={handleSummaryChange}
                />
              </Form.Group>
              {/* Place for title input */}
              <Form.Group controlId="summaryTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title for your summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              {/* Save button */}
              <Button
                variant="success"
                onClick={saveSummaryContent}
                className="mt-2">
                Save Summary
              </Button>
              {/* Feedback message */}
              {saveStatus && (
                <Alert
                  className="mt-2"
                  variant={
                    saveStatus.startsWith("Failed") ? "danger" : "success"
                  }>
                  {saveStatus}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default TextSummarizer;
