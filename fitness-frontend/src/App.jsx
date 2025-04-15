import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { setCredentials, logout } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { getActivities } from "./services/api";

const ActivityPage = () => {
  const theme = useTheme();
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.background.paper} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
        }}
      >
        <ActivityForm onActivityAdded={fetchActivities} />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.05)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{
            mb: 3,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FitnessCenterIcon fontSize="medium" />
          Your Activity History
        </Typography>
        <ActivityList activities={activities} />
      </Paper>
    </Container>
  );
};

function App() {
  const theme = useTheme();
  const {
    token,
    tokenData,
    logIn,
    logOut: contextLogOut,
    isAuthenticated,
  } = useContext(AuthContext);

  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    contextLogOut();
  };

  return (
    <Router>
      <CssBaseline />
      {!token ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.background.default} 100%)`,
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 4,
              boxShadow: theme.shadows[4],
              maxWidth: 500,
              width: "100%",
            }}
          >
            <FitnessCenterIcon
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            />
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FitTrack Pro
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }} color="text.secondary">
              Track your fitness journey with personalized insights and progress
              analytics
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => logIn()}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: theme.shadows[4],
                "&:hover": {
                  boxShadow: theme.shadows[8],
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{
              bgcolor: "background.paper",
              borderBottom: `1px solid ${theme.palette.divider}`,
              color: "text.primary",
              backdropFilter: "blur(8px)",
              background: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Toolbar
              sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FitnessCenterIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  FitTrack Pro
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {tokenData?.picture && (
                  <Avatar
                    alt="User"
                    src={tokenData.picture}
                    sx={{
                      width: 40,
                      height: 40,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                )}
                <IconButton
                  onClick={handleLogout}
                  color="inherit"
                  sx={{
                    p: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "error.main",
                    },
                  }}
                >
                  <ExitToAppIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/activities" element={<ActivityPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/activities" replace />
                ) : (
                  <Box textAlign="center" mt={4}>
                    <Typography>Welcome! Please Login.</Typography>
                  </Box>
                )
              }
            />
          </Routes>
        </Box>
      )}
    </Router>
  );
}

export default App;
