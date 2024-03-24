// SummarizerComponent.tsx
import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const tones = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  // ... add other tones as needed
];

const Summarizer2: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [includeReferences, setIncludeReferences] = useState(false);
  const [summaryLength, setSummaryLength] = useState<number>(0);
  const [summary, setSummary] = useState<string>("");

  const handleToneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTone(event.target.value);
  };

  const handleReferenceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeReferences(event.target.checked);
  };

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadFileName(file.name);
    setFileError("");

    const formData = new FormData();
    formData.append("file", file);

    fetch(
      "http://localhost:8765/DOCUMENT-HANDLING-SERVICE/api/document/uploadPdf",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.text())
      .then((data) => {
        setInputText(data);
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
      });
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setFileError(
        "Invalid file type. Only .pdf, .doc, .docx, .txt files are allowed."
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: [".pdf", ".doc", ".docx", ".txt"],
  });

  const handleSummarizeClick = () => {
    if (!inputText) {
      alert("Please upload text before summarizing");
      return;
    }

    const url = "http://localhost:8765/SUMMARY-SERVICE/api/summarize";
    const payload = {
      text: inputText,
      tone: tone,
      length: summaryLength,
      includeReferences: includeReferences,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Server response wasn't OK");
        }
      })
      .then((summaryText) => {
        setShowSummary(true);
        setSummary(summaryText);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          Input Text or Upload File (pdf, word, txt)
        </Typography>
      </Box>
      <Box
        {...getRootProps()}
        sx={{
          border: "1px dashed grey",
          borderRadius: 2,
          p: 2,
          mb: 2,
          textAlign: "center",

          backgroundColor: isDragActive
            ? "rgba(0, 0, 0, 0.20)"
            : "rgba(0, 0, 0, 0.12)",
        }}>
        <input {...getInputProps()} />
        <Typography>
          {uploadFileName ||
            (isDragActive
              ? "Drop the file here ..."
              : "Drag & drop a file here, or click to select a file")}
          {fileError && <FormHelperText error>{fileError}</FormHelperText>}
        </Typography>
      </Box>
      <TextField
        fullWidth
        label="Input Text"
        variant="outlined"
        multiline
        minRows={4}
        maxRows={6}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        sx={{ mb: 2, backgroundColor: "rgba(0, 0, 0, 0.09)" }}
      />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField
            label="Length of Summary"
            type="number"
            variant="outlined"
            value={summaryLength}
            onChange={(e) => setSummaryLength(Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">-</InputAdornment>
              ),
            }}
            sx={{
              width: "calc(50% - 8px)",
              backgroundColor: "rgba(0, 0, 0, 0.09)", // The color inside the dropdown
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="Tone of Summary"
            value={tone}
            onChange={handleToneChange}
            variant="outlined"
            sx={{
              width: "calc(50% - 8px)", // Adjust width similarly
              ".MuiSelect-select": {
                paddingRight: "24px", // Adjust right padding to show the background color
                backgroundColor: "rgba(0, 0, 0, 0.09)", // The color inside the dropdown
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.23)", // Adjust border color
              },
            }}>
            {tones.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            checked={includeReferences}
            onChange={handleReferenceChange}
          />
        }
        label="Include References"
        sx={{ mb: 2 }}
      />

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "50%", mb: 2 }}
          onClick={handleSummarizeClick}>
          {" "}
          Generate Summary
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Summary"
        variant="outlined"
        multiline
        minRows={4}
        value={summary}
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default Summarizer2;
