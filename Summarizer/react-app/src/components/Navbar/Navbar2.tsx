import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";

import { indigo } from "@mui/material/colors"; // Importing the indigo color
import LoginIcon from "@mui/icons-material/Login"; // Importing the login icon
import AuthForm from "./AuthForm"; // Import the AuthForm component
import Cookies from "js-cookie";

// Define the types of props Navbar2 accepts
interface Navbar2Props {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

const Navbar2: React.FC<Navbar2Props> = ({
  isLoggedIn,
  onLoginSuccess,
  onLogout,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false); // To toggle between Sign Up and Log In forms
  const handleLoginSuccess = () => {
    handleClose(); // Closes the modal
    // Further actions can be placed here if necessary, such as showing other components
  };

  const modalStyle = {
    position: "absolute" as const, // 'as const' is used for type assertion here
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = (signUp: boolean) => {
    setIsSignUp(signUp);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  return (
    <>
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
            <Button
              sx={{ color: theme.palette.text.secondary }}
              onClick={() => navigate("/")}>
              Home
            </Button>
            <Button sx={{ color: theme.palette.text.secondary }}>About</Button>
          </Box>
          <Box
            sx={{
              order: 2,
              [theme.breakpoints.up("md")]: {
                order: 3,
              },
            }}>
            {!isLoggedIn ? (
              <>
                <Button
                  startIcon={<LoginIcon />}
                  variant="contained"
                  onClick={() => handleOpen(false)}
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
                  onClick={() => handleOpen(true)}
                  sx={{
                    bgcolor: indigo[500],
                    "&:hover": { bgcolor: indigo[600] },
                    color: theme.palette.grey[50],
                  }}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => navigate("/user-dashboard")}
                  sx={{
                    bgcolor: indigo[500],
                    "&:hover": { bgcolor: indigo[600] },
                    color: theme.palette.grey[50],
                    mr: 1,
                  }}>
                  User Account
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    onLogout();
                    Cookies.remove("token");
                    Cookies.remove("userId");
                  }}
                  sx={{
                    bgcolor: indigo[500],
                    "&:hover": { bgcolor: indigo[600] },
                    color: theme.palette.grey[50],
                  }}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={open}>
          <Box sx={modalStyle}>
            <AuthForm isSignUp={isSignUp} onLoginSuccess={onLoginSuccess} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
export default Navbar2;
