import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  commentOnPost,
  getPostsByUser
} from '../controllers/post.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRUD Routes
router.get('/', getAllPosts);                    // Get all posts

// Get posts for a specific user (MUST be before :id route)
router.get('/user/:userId', getPostsByUser);     // ✅ Moved above

router.get('/:id', getPostById);                 // Get a single post by ID
router.post('/', protect, createPost);           // Create a new post (protected)
router.put('/:id', protect, updatePost);         // Update a post (protected)
router.delete('/:id', protect, deletePost);      // Delete a post (protected)

// Like/Unlike a Post (toggle)
router.put('/:id/like', protect, likePost);

// Add a comment to a post
router.post('/:id/comment', protect, commentOnPost);

export default router;
