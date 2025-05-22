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
  const [anonPostCount, setAnonPostCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Routes>
        {/* Redirect to signup if not logged in */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/signup"} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Only accessible if logged in */}
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
