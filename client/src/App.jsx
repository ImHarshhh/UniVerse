import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PostForm from "./pages/PostForm";
import Subscription from "./pages/Subscription";
import AuthContext from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import PlanOne from './pages/PlanOne';
import PlanFive from './pages/PlanFive';
import PlanTen from './pages/PlanTen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Added: New loading state, initially true
  const [anonPostCount, setAnonPostCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false); // Added: Set loading to false once localStorage check is complete
  }, []);

  // Added: Render a loading indicator while the authentication state is being checked
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '24px',
        color: '#333'
      }}>
        Loading application...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Routes>
        {/* Changed: Redirect to /login if not authenticated. */}
        {/* The 'loading' state ensures this redirect only happens after the token check. */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Only accessible if logged in */}
        {/* PrivateRoute component will handle further redirection if isAuthenticated changes after initial load */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/home" element={<Home />} />
          <Route
            path="/new-post"
            element={anonPostCount > 3 ? <Navigate to="/subscribe" /> : <PostForm setAnonPostCount={setAnonPostCount} />}
          />
          <Route path="/subscribe" element={<Subscription />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Add routes for the subscription plans */}
        <Route path="/planone" element={<PlanOne />} />
        <Route path="/planfive" element={<PlanFive />} />
        <Route path="/planten" element={<PlanTen />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;