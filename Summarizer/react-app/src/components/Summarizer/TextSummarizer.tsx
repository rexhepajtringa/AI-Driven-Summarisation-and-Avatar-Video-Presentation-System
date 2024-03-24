import React, { useState, useCallback, useEffect, useRef } from "react";
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

const RangeExample = ({ sliderValue, setSliderValue }) => {
  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  return (
    <div>
      <Form.Label>Length of Summary</Form.Label>
      <Form.Range
        value={sliderValue}
        onChange={handleSliderChange}
        className="custom-slider"
      />
      <p>Selected Value: {sliderValue}</p>
    </div>
  );
};

const TextSummarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [summaryLength, setSummaryLength] = useState(50);
  const [includeReferences, setIncludeReferences] = useState(false);
  const [summaryTone, setSummaryTone] = useState("Neutral");
  const handleSummaryChange = (e) => {
    setSummaryText(e.target.value);
  };

  const handleFileChange = async (file) => {
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
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
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please input text before summarizing");
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
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
                    style={{ backgroundColor: "#ededed" }}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <RangeExample
                      sliderValue={summaryLength}
                      setSliderValue={setSummaryLength}
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
                        <option value="Positive">Positive</option>
                        <option value="Negative">Negative</option>
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
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default TextSummarizer;
