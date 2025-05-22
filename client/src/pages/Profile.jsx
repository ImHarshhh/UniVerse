import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser ] = useState(null);
  const [posts, setPosts] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser  = async () => {
      try {
        const res = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser (data);

        const postRes = await fetch(`${apiBaseUrl}/api/posts/user/${data._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const postData = await postRes.json();
        if (Array.isArray(postData)) {
          setPosts(postData);
        } else {
          console.warn("Post data is not an array:", postData);
          setPosts([]);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchUser ();
  }, []);

  if (!user) return <p style={styles.loading}>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.username}>@{user.username}</h2>
        <p style={styles.email}>{user.email}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Your Posts</h3>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} style={styles.postCard}>
              <p style={styles.postContent}>{post.content}</p>
              {post.image && (
                <img src={post.image} alt="post" style={styles.postImage} />
              )}
              <div style={styles.meta}>
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>

              {/* Comments Section */}
              {post.comments && post.comments.length > 0 && (
                <div style={styles.commentsSection}>
                  <h4 style={styles.commentHeader}>Comments</h4>
                  {post.comments.map((comment, index) => (
                    <div key={index} style={styles.commentBox}>
                      <span style={styles.commentAuthor}>
                        {comment.authorName || "User "}
                      </span>
                      <p style={styles.commentText}>{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={styles.noPosts}>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f0f2f5", // Light background for the entire page
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  loading: {
    textAlign: "center",
    paddingTop: "100px",
    fontSize: "18px",
    color: "#777",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
    textAlign: "center",
  },
  username: {
    margin: "0",
    fontSize: "28px",
    color: "#333",
  },
  email: {
    color: "#888",
    fontSize: "16px",
  },
  section: {
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "10px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "5px",
    color: "#444",
  },
  postCard: {
    background: "#ffffff",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "0.3s",
    cursor: "pointer",
    '&:hover': {
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
  },
  postContent: {
    fontSize: "16px",
    marginBottom: "10px",
    lineHeight: "1.5",
  },
  postImage: {
    maxWidth: "100%",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#888",
    marginTop: "5px",
    marginBottom: "10px",
  },
  commentsSection: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "10px",
  },
  commentHeader: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    color: "#444",
  },
  commentBox: {
    marginBottom: "8px",
    paddingBottom: "6px",
    borderBottom: "1px solid #ddd",
  },
  commentAuthor: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#222",
  },
  commentText: {
    margin: "2px 0 0 0",
    fontSize: "14px",
    color: "#333",
  },
  noPosts: {
    color: "#aaa",
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default Profile;
