import { FunctionComponent, useCallback, useState } from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Checkbox,
  FormControlLabel,
  Slider,
  Box,
  Button,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  FormHelperText,
  FormControl,
} from "@mui/material";
import styles from "./SummarizerComponent.module.css";
import { useDropzone } from "react-dropzone";
import React from "react";

const tones = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  // Add other tones as needed
];

const Summarizer: FunctionComponent = () => {
  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState("");
  const [includeReferences, setIncludeReferences] = useState(false);
  const [summaryLength, setSummaryLength] = useState(10);

  const onButtonClick = useCallback(() => {
    //TODO: Implement Summarize API call logic here
  }, [inputText, tone, includeReferences, summaryLength]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Assuming you're uploading a single file and reading it as text
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setInputText(reader.result as string);
      };
      reader.readAsText(file);
    },
    accept: "text/plain",
  });

  const dropboxStyle = {
    border: "1px dashed grey",
    borderRadius: "2px",
    left: "12.5rem",
    padding: "10px", // 'p: 2' is typically 8px per unit in MUI, so '2' would be 16px
    marginBottom: "16px", // Similarly, 'mb: 2' translates to a margin-bottom of 16px
    backgroundColor: isDragActive
      ? "rgba(0, 0, 0, 0.20)"
      : "rgba(0, 0, 0, 0.12)",
  };
  const handleSummarize = async () => {
    if (inputText) {
      const payload = {
        text: inputText,
        tone: tone,
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
        setSummaryText(summary); // This will update the summary textarea
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please input text before summarizing");
    }
  };
  return (
    <div className={styles.paperParent}>
      <div className={styles.paper}></div>
      <h1 className={styles.title}>Input text to summarize</h1>

      <div {...getRootProps()} className={styles.dropbox} style={dropboxStyle}>
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? "Drop the file here ..."
            : "Drag & Drop File or Click to Upload"}
        </Typography>
      </div>

      <div className={styles.summaryinputfield}>
        <TextField
          fullWidth
          label="Input Text"
          variant="outlined"
          multiline
          minRows={10}
          maxRows={10}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ mb: 2, backgroundColor: "rgba(0, 0, 0, 0.09)" }}
        />
      </div>

      <div className={styles.title1}>or</div>

      <div className={styles.formcontrollabelCheckbox}>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeReferences}
              onChange={(e) => setIncludeReferences(e.target.checked)}
              name="includereferences"
              color="primary"
            />
          }
          label="Include References"
        />
      </div>

      <Typography className={styles.lengthOfSummary}>
        Length of Summary
      </Typography>
      <Slider
        className={styles.slider}
        value={summaryLength}
        onChange={(e, newValue) => {
          if (typeof newValue === "number") {
            setSummaryLength(newValue);
          }
        }}
        // aria-labelledby="input-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={30}
        sx={{ width: "10rem" }}
      />

      <div className={styles.toneOfSummary}>
        <FormControl style={{ minWidth: "175px" }}>
          <InputLabel>Tone of Summary</InputLabel>
          <Select
            value={tone}
            label="Tone of Summary"
            onChange={(e) => setTone(e.target.value)}
            sx={{ mb: 2, backgroundColor: "rgba(0, 0, 0, 0.09)" }}>
            {tones.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Button
        variant="contained"
        type="button"
        sx={{
          color: "#fff",
          fontSize: "15",
          background: "#2196f3",
          borderRadius: "4px",
          "&:hover": { background: "#2196f3" },
          width: 126,
          height: 49,
        }}
        onClick={handleSummarize}>
        Summarize
      </Button>
      <div className={styles.summaryoutputfield}>
        <TextField
          fullWidth
          label="Summary Output"
          variant="outlined"
          multiline
          minRows={15}
          maxRows={15}
          sx={{ mb: 2, backgroundColor: "rgba(0, 0, 0, 0.09)" }}
        />
      </div>
    </div>
  );
};

export default Summarizer;
