import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../services/authServices"; // Assuming this is correct
import PostCard from "../components/PostCard";
// IMPORTANT: Make sure Navbar and Sidebar components actually exist in these paths
// If they don't, you need to create them or remove their imports/usage.


const Home = () => {
  // IMPORTANT: Ensure this environment variable is set on Render for your frontend service!
  // Example: REACT_APP_API_BASE_URL = https://universe-backend-2yh9.onrender.com
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL; 

  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true); // Added loading state for posts
  const [loadingUser, setLoadingUser] = useState(true);   // Added loading state for user profile

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token"); // Get token outside useEffect for immediate access

  const fetchUser = async () => {
    setLoadingUser(true); // Set loading before fetch
    try {
      // Ensure getCurrentUser also uses the correct API_BASE_URL internally
      const userData = await getCurrentUser(); 
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      // Optionally set an error for user profile, but often profile errors are less critical than posts
    } finally {
      setLoadingUser(false); // Set loading to false after fetch
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true); // Set loading before fetch
    try {
      if (!apiBaseUrl) { // Added check for API Base URL
        throw new Error("API Base URL is not defined. Please check your environment variables.");
      }
      
      const res = await axios.get(`${apiBaseUrl}/api/posts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true, // Crucial for sending cookies with protected routes
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (axios.isAxiosError(err) && err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.message || `Failed to load posts: ${err.response.status}`);
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (axios.isAxiosError(err) && err.request) {
        // Request was made but no response received
        setError("Failed to load posts: No response from server. Check backend URL or network.");
        console.error("Request:", err.request);
      } else {
        // Something else happened in setting up the request or the custom error
        setError("Failed to load posts: Error setting up request or unknown error. " + err.message);
      }
    } finally {
      setLoadingPosts(false); // Set loading to false after fetch
    }
  };

  useEffect(() => {
    // Only fetch if token exists to avoid unnecessary calls for unauthenticated users
    if (token) { 
      fetchUser();
      fetchPosts();
    } else {
      // If no token, set loading to false and inform the user
      setLoadingUser(false);
      setLoadingPosts(false);
      setError("Please log in to view posts."); // Inform the user
    }
  }, [token]); // Re-run if token changes (e.g., after login/logout)

  const handleLike = async (postId) => {
    try {
      if (!token || !user) return; // Prevent action if not authenticated or user not loaded
      await axios.put(
        `${apiBaseUrl}/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes.includes(user.username);
            const updatedLikes = isLiked
              ? post.likes.filter((u) => u !== user.username)
              : [...post.likes, user.username];
            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText || !token || !user) return; // Prevent action if not authenticated, empty comment, or user not loaded

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, res.data] }
            : post
        )
      );

      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar - assuming this component exists or its JSX is here */}
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Menu</h2>
        <nav>
          <Link to="/home" style={styles.link}>🏠 Home</Link>
          <Link to="/new-post" style={styles.link}>✍️ New Post</Link>
        </nav>
      </aside>

      {/* Main Feed */}
      <main style={styles.feed}>
        {/* Navbar - assuming this component exists or its JSX is here */}
        <Navbar /> 

        {/* Conditional rendering for posts content */}
        {loadingPosts ? (
          <p style={styles.loadingMessage}>Loading posts...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} style={styles.card}>
              <div style={styles.postHeader}>
                {post.anonymous ? (
                  <h3 style={styles.author}>Anonymous</h3>
                ) : (
                  <Link to={`/profile/${post.author._id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ ...styles.author, color: "#007bff", cursor: "pointer" }}>
                      {post.authorName}
                    </h3>
                  </Link>
                )}
              </div>

              <p style={styles.content}>{post.content}</p>

              <div style={styles.actionRow}>
                <button onClick={() => handleLike(post._id)} style={styles.likeBtn}>
                  ❤️ {user && post.likes.includes(user.username) ? "Unlike" : "Like"}
                </button>
                <span style={styles.likeCount}>{post.likes.length} likes</span>
              </div>

              <div style={styles.commentsSection}>
                <strong>Comments:</strong>
                {post.comments.map((c, idx) => (
                  <div key={idx} style={styles.comment}>
                    <strong>{c.authorName || "Anonymous"}:</strong> {c.text}
                  </div>
                ))}
              </div>

              <div style={styles.commentBox}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post._id] || ""}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                  }
                  style={styles.input}
                />
                <button onClick={() => handleComment(post._id)} style={styles.commentBtn}>
                  Comment
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noPostsMessage}>No posts available. Be the first to create one!</p>
        )}
      </main>

      {/* Profile Section */}
      <aside style={styles.profileSection}>
        <h2 style={styles.sidebarTitle}>👤 Profile</h2>
        {/* Conditional rendering for user profile */}
        {loadingUser ? (
          <p>Loading profile...</p>
        ) : user ? (
          <>
            <p><strong>{user.username}</strong></p>
            <p>{user.email}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              <button onClick={() => navigate("/profile")} style={styles.logoutBtn}>Profile</button>
            </div>
          </>
        ) : (
          <p>Not logged in or failed to load profile.</p> // More informative message
        )}
      </aside>
    </div>
  );
};

// UI Styles (rest of your styles are unchanged)
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "Segoe UI, sans-serif",
  },
  sidebar: {
    width: "18%",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  profileSection: {
    width: "18%",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
  },
  feed: {
    flex: 1,
    padding: "25px 40px",
    overflowY: "auto",
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  author: {
    fontSize: "18px",
    color: "#1DA1F2",
  },
  content: {
    fontSize: "16px",
    marginBottom: "15px",
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  likeBtn: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    padding: "6px 14px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  likeCount: {
    fontSize: "14px",
    color: "#666",
  },
  commentsSection: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  comment: {
    marginTop: "5px",
    paddingLeft: "10px",
    borderLeft: "2px solid #ddd",
  },
  commentBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  commentBtn: {
    backgroundColor: "#1DA1F2",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  link: {
    display: "block",
    marginBottom: "10px",
    textDecoration: "none",
    fontSize: "18px",
    color: "#1DA1F2",
  },
  sidebarTitle: {
    marginBottom: "15px",
    fontSize: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  logoutBtn: {
    marginTop: "15px",
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
    fontSize: "16px",
    padding: "10px",
    backgroundColor: "#ffe0e0",
    borderRadius: "5px",
  },
  loadingMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
    marginTop: "20px",
  },
  noPostsMessage: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
    marginTop: "20px",
  },
  navbar: {
    width: "100%",
    padding: "10px 20px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e6e6e6",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  brandImg: {
    height: "40px",
  },
  searchBox: {
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    width: "200px",
    outline: "none",
  },
  navItems: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  icon: {
    height: "24px",
    width: "24px",
    cursor: "pointer",
  },
  userProfile: {
    height: "32px",
    width: "32px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
  },
};

export default Home;