import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"; // Corrected import
import { setCredentials, logout } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActivityPage = () => {
  return (
    <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
      <ActivityForm
        onActivitiesAdded={() => {
          /* You can use state management here */
        }}
      />
      <ActivityList />
    </Box>
  );
};

function App() {
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
      {!token ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to the fitness Tracker App
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Please login to access your activities
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={()=>logIn()}
          >
            Login
          </Button>
        </Box>
      ) : (
        <div>
          <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              style={{ marginTop: "20px", marginLeft: "10px" }}
            >
              Logout
            </Button>
            <Routes>
              <Route path="/activities" element={<ActivityPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route
                path="/"
                element={
                  token ? (
                    <Navigate to="/activities" replace />
                  ) : (
                    <div>Welcome! Please Login.</div>
                  )
                }
              />
            </Routes>
          </Box>
        </div>
      )}
    </Router>
  );
}

export default App;
