import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import MediaPlayer from "../MediaPlayer/MediaPlayer"; // Import the MediaPlayer component
import styles from "./HighlightMedia.module.css"; // Optional: Add styling

const HighlightMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For navigation
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // Track current media index

  useEffect(() => {
    const fetchHighlightMedia = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/highlights/highlights/${id}/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHighlight(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightMedia();
  }, [id]);

  const goToNextMedia = () => {
    if (currentMediaIndex < highlight.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const goToPreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleClose = () => {
    navigate("/"); // Navigate back to the main page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!highlight) {
    return <div>No highlight found.</div>;
  }

  const currentMedia = highlight.media[currentMediaIndex];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <button onClick={handleClose} className={styles.closeButton}>
          &times; {/* Close icon */}
        </button>
        <h2 className={styles.title}>{highlight.title}</h2>
        <div className={styles.mediaWrapper}>
          <button
            onClick={goToPreviousMedia}
            disabled={currentMediaIndex === 0}
            className={styles.navButton}
          >
            {"<"}
          </button>
          <div className={styles.mediaItem}>
            <MediaPlayer media={currentMedia} />
          </div>
          <button
            onClick={goToNextMedia}
            disabled={currentMediaIndex === highlight.media.length - 1}
            className={styles.navButton}
          >
            {">"}
          </button>
        </div>
        <div className={styles.mediaIndicator}>
          {highlight.media.map((_, index) => (
            <span
              key={index}
              className={`${styles.indicatorDot} ${
                index === currentMediaIndex ? styles.active : ""
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightMedia;
