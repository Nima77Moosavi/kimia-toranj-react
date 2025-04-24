// Blog.jsx
import React, { useState, useEffect } from "react";
import styles from "./Blog.module.css";
import axios from "axios";
import { BASE_URL } from "../../config"; // Optional: if you’re using a constants file

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts when the component mounts
  useEffect(() => {
    axios
      .get(`${BASE_URL || "http://127.0.0.1:8000"}/api/blog/posts/`) // Use BASE_URL constant if available
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading posts.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.blogContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.blogContainer}>{error}</div>;
  }

  // Separate the first 4 posts, and the rest as other posts.
  const topPosts = posts.slice(0, 4);
  const otherPosts = posts.slice(4);

  return (
    <div className={styles.blogContainer}>
      <h1 className={styles.title}>Blog</h1>

      {/* Top Posts: first 4 posts in a grid */}
      <div className={styles.topPosts}>
        {topPosts.map((post) => (
          <div key={post.id} className={styles.topPost}>
            {/* Display the first image if it exists */}
            {post.images && post.images.length > 0 && (
              <img
                src={post.images[0].image}
                alt={post.title}
                className={styles.postImage}
              />
            )}
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postContent}>{post.content}</p>
          </div>
        ))}
      </div>

      {/* Other posts: remaining posts in list view */}
      <div className={styles.posts}>
        {otherPosts.map((post) => (
          <div key={post.id} className={styles.post}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postContent}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
