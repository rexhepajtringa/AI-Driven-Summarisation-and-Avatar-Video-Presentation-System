import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import { indigo } from "@mui/material/colors"; // Importing the indigo color
import LoginIcon from "@mui/icons-material/Login"; // Importing the login icon

const Navbar2: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.text.primary,
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.12), 0 7px 8px -5px rgba(0,0,0,0.2)`,
        px: 2,
        [theme.breakpoints.up("md")]: {
          px: "auto",
        },
      }}>
      <Toolbar
        sx={{
          minHeight: "56px",
          maxLength: "xl",
          [theme.breakpoints.up("md")]: {
            minHeight: "64px",
            justifyContent: "space-between",
            px: 4,
          },
        }}>
        {/* Centered title replaced with "Text Summarizer Builder" */}

        <Typography
          variant="h6"
          noWrap
          sx={{
            color: indigo[500],
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            [theme.breakpoints.up("md")]: {
              flexGrow: 0,
              justifyContent: "flex-start",
            },
          }}>
          Text Summarizer Builder
        </Typography>
        {/* Navigation Links */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            order: 3,
            [theme.breakpoints.up("md")]: {
              flexGrow: 0,
              order: 2,
              width: "auto",
            },
          }}>
          <Button sx={{ color: theme.palette.text.secondary }}>Home</Button>
          <Button sx={{ color: theme.palette.text.secondary }}>About</Button>
        </Box>
        {/* Adjusted Login and Sign Up Buttons to match the example */}
        <Box
          sx={{
            order: 2,
            [theme.breakpoints.up("md")]: {
              order: 3,
            },
          }}>
          <Button
            startIcon={<LoginIcon />}
            variant="contained"
            sx={{
              bgcolor: indigo[500],
              "&:hover": {
                bgcolor: indigo[600],
              },
              color: theme.palette.grey[50],
              mr: 1,
            }}>
            Login
          </Button>

          <Button
            variant="contained"
            sx={{
              bgcolor: indigo[500],
              "&:hover": { bgcolor: indigo[600] },
              color: theme.palette.grey[50],
            }}>
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar2;
