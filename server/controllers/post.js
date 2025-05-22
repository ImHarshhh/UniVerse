  import Post from '../models/Post.js';
  import User from '../models/Users.js';

  // Create Post (unchanged)
  export const createPost = async (req, res) => {
  const { content, anonymous } = req.body;

  if (!content) return res.status(400).json({ message: "Content is required" });

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check for anon post limit if not subscribed
    if (anonymous && user.anonPostCount >= user.anonPostLimit) {
      return res.status(403).json({ message: "Anonymous post limit reached. Please subscribe to continue." });
    }

    const newPost = new Post({
      content,
      author: req.user._id,
      authorName: anonymous ? 'Anonymous User' : req.user.username,
      anonymous
    });

    await newPost.save();

    // ✅ Increment anonPostCount if not subscribed
    if (anonymous) {
      user.anonPostCount += 1;
      await user.save();
    }

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

  // Get All Posts (with populated comments)
  export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'username');
      res.status(200).json(posts);
    } catch (error) {
      console.error("Fetch Posts Error:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };

  // Get Single Post
  export const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      res.status(200).json(post);
    } catch (error) {
      console.error("Fetch Post Error:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };

  // Update Post
  export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Content is required for update." });

    try {
      const updatedPost = await Post.findByIdAndUpdate(id, { content }, { new: true });

      if (!updatedPost) return res.status(404).json({ message: "Post not found" });

      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Update Post Error:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };

  // Delete Post
  export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) return res.status(404).json({ message: "Post not found" });

      res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
      console.error("Delete Post Error:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };

  // Like Post (toggle like)
  export const likePost = async (req, res) => {
    const { id } = req.params; // post ID
    const userId = req.user._id;

    try {
      const post = await Post.findById(id);

      if (!post) return res.status(404).json({ message: "Post not found" });

      const alreadyLiked = post.likes.includes(userId);

      if (alreadyLiked) {
        post.likes = post.likes.filter((uid) => uid.toString() !== userId.toString());
      } else {
        post.likes.push(userId);
      }

      await post.save();
      res.status(200).json({ likes: post.likes.length });
    } catch (error) {
      console.error("Like Post Error:", error);
      res.status(500).json({ message: "Server error while liking post" });
    }
  };

  // Add Comment
  export const commentOnPost = async (req, res) => {
    const { id } = req.params; // post ID
    const { text, anonymous } = req.body;

    if (!text) return res.status(400).json({ message: "Comment text is required." });

    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const comment = {
        text,
        author: req.user._id,
        authorName: anonymous ? "Anonymous User" : req.user.username,
        anonymous
      };

      post.comments.push(comment);
      await post.save();

      res.status(201).json(post.comments);
    } catch (error) {
      console.error("Comment Error:", error);
      res.status(500).json({ message: "Server error while commenting" });
    }
  };

  // Get posts by a specific user
  export const getPostsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Exclude posts where `anonymous: true`
      const posts = await Post.find({ author: userId, anonymous: false }).sort({ createdAt: -1 });
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts by user:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  
