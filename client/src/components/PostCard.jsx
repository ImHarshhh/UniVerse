// src/components/PostCard.jsx

const PostCard = ({ post, user, commentText, onLike, onComment, onCommentInputChange }) => {
    return (
      <div style={styles.card}>
        <div style={styles.postHeader}>
          <h3 style={styles.author}>{post.anonymous ? "Anonymous" : post.authorName}</h3>
        </div>
        <p style={styles.content}>{post.content}</p>
  
        <div style={styles.actionRow}>
          <button onClick={() => onLike(post._id)} style={styles.likeBtn}>
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
            value={commentText}
            onChange={(e) => onCommentInputChange(post._id, e.target.value)}
            style={styles.input}
          />
          <button onClick={() => onComment(post._id)} style={styles.commentBtn}>
            Comment
          </button>
        </div>
      </div>
    );
  };
  
  const styles = {
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
  };
  
  export default PostCard;
  