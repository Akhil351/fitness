import { Box, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";  // Corrected import
import { setCredentials, logout } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActivityPage = () => {
  return ( 
    <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
      <ActivityForm onActivitiesAdded={() => {/* You can use state management here */}} />
      <ActivityList />
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut: contextLogOut, isAuthenticated } = useContext(AuthContext);
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

  if (!authReady) return <div>Loading...</div>;  // Optional: Loading state until auth is ready

  return (
    <Router>
      {!token ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={logIn}
          style={{ marginTop: "20px" }}
        >
          Login
        </Button>
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
                element={token ? <Navigate to="/activities" replace /> : <div>Welcome! Please Login.</div>}
              />
            </Routes>
          </Box>
        </div>
      )}
    </Router>
  );
}

export default App;
