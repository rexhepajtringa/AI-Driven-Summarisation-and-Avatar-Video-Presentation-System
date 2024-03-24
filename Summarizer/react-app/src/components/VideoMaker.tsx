// VisualizerComponent.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const VideoMaker: React.FC = () => {
  const [voice, setVoice] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setVoice(event.target.value as string);
  };

  return (
    <Box my={2} display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth>
        <InputLabel id="voice-select-label">Voice</InputLabel>
        <Select
          labelId="voice-select-label"
          id="voice-select"
          value={voice}
          label="Voice"
         // onChange={handleChange}
        >
          {/* Map your menu items here */}
        </Select>
      </FormControl>
      <Button variant="contained" component="label">
        Upload Image
        <input type="file" hidden />
      </Button>
      <Button variant="contained" color="secondary">
        Create Video
      </Button>
    </Box>
  );
};

export default VideoMaker;
