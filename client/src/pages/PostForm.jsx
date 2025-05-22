import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonPostCount, setAnonPostCount] = useState(0);
  const [anonPostLimit, setAnonPostLimit] = useState(3); // Initialize with a default value
  const navigate = useNavigate();
  const anonLeft = anonPostLimit - anonPostCount;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${apiBaseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnonPostCount(res.data.anonPostCount || 0);
  
        // Assuming your backend sends 'anonPostLimit' in the user data
        setAnonPostLimit(res.data.anonPostLimit || 3); // Use fetched limit, default to 3
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handlePostSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${apiBaseUrl}/api/posts`,
        { content, anonymous: isAnonymous },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (isAnonymous) {
        setAnonPostCount((prev) => prev + 1); // Update local state (optional)
        // You might also want to update the anonPostCount on the backend here
        // depending on your application's logic.
      }

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleSubscribeRedirect = () => {
    navigate("/subscribe");
  };

  return (
    <div style={styles.container}>
    <h2 style={styles.title}>Create a Post</h2>
  
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Write something..."
      style={styles.textarea}
    />
  
    <div style={styles.checkboxContainer}>
      <label style={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          style={styles.checkbox}
        />
        Post Anonymously
        {(
          
          <span style={styles.countText}>
            (Anon Post Left : {anonLeft})
          </span>
        )}
      </label>
    </div>
  
    {isAnonymous && anonPostCount >= anonPostLimit ? (
      <button onClick={handleSubscribeRedirect} style={styles.button}>
        Subscribe
      </button>
    ) : (
      <button onClick={handlePostSubmit} style={styles.button}>
        Submit
      </button>
    )}
  </div>
  
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "none",
    marginBottom: "20px",
    fontFamily: "inherit",
  },
  checkboxContainer: {
    marginBottom: "20px",
  },
  checkboxLabel: {
    fontSize: "16px",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  checkbox: {
    transform: "scale(1.2)",
  },
  button: {
    backgroundColor: "#1877f2",
    color: "#fff",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease-in-out",
  },
  countText: {
    marginLeft: "10px",
    fontSize: "14px",
    color: "#777",
  },
};

export default PostForm;
