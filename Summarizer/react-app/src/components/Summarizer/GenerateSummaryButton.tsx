import React from 'react';
import { Button } from '@mui/material';

interface GenerateSummaryButtonProps {
  onClick: () => void; // Define other props as needed
}

export const GenerateSummaryButton: React.FC<GenerateSummaryButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      sx={{ width: '50%', mt: 2 }}
    >
      Generate Summary
    </Button>
  );
};
