import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../services/authServices";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
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
    if (!commentText) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: commentText },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
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
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Menu</h2>
          <nav>
            <Link to="/" style={styles.link}>🏠 Home</Link>
            <Link to="/new-post" style={styles.link}>✍️ New Post</Link>
          </nav>
        </aside>

        {/* Main Feed */}
        <main style={styles.feed}>
          {/* Top Navbar */}
          

          {error && <p style={styles.error}>{error}</p>}

          {posts.map((post) => (
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
          ))}
        </main>

        {/* Profile */}
          <aside style={styles.profileSection}>
                  <h2 style={styles.sidebarTitle}>👤 Profile</h2>
                  {user ? (
              <>
                <p><strong>{user.username}</strong></p>
                <p>{user.email}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                  <button onClick={() => navigate("/profile")} style={styles.logoutBtn}>Profile</button>
                </div>
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </aside>
      </div>
    );
  };

  // UI Styles
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
