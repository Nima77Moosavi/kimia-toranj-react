import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import styles from "./HighlightMedia.module.css";
import { IoClose } from "react-icons/io5";

const HighlightMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(null);
  const [allHighlight, setAllHighlight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [progress, setProgress] = useState(0); // Start from 0% and fill to 100%
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(true); // Track visibility of progress bar

  // Fetch specific highlight
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

        // Find the index of the current highlight in allHighlight
        const highlightIndex = allHighlight.findIndex(
          (h) => h.id === parseInt(id)
        );
        if (highlightIndex !== -1) {
          setCurrentHighlightIndex(highlightIndex); // Update currentHighlightIndex
          setCurrentMediaIndex(0); // Reset currentMediaIndex to 0
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightMedia();
  }, [id, allHighlight]);

  // Fetch all highlights
  useEffect(() => {
    const fetchAllHighlightMedia = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/highlights/highlights/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllHighlight(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHighlightMedia();
  }, []);

  // Auto-change media every 10 seconds and update progress bar
  useEffect(() => {
    if (allHighlight.length === 0) return;

    const interval = setInterval(() => {
      const currentHighlight = allHighlight[currentHighlightIndex];
      if (currentMediaIndex < currentHighlight.media.length - 1) {
        setCurrentMediaIndex(currentMediaIndex + 1); // Go to next media in the current highlight
      } else {
        // If it's the last media in the current highlight, move to the next highlight
        setCurrentHighlightIndex((prevIndex) =>
          prevIndex < allHighlight.length - 1 ? prevIndex + 1 : 0
        );
        setCurrentMediaIndex(0); // Reset media index for the new highlight
      }
      setProgress(0); // Reset progress bar
      setIsProgressBarVisible(true); // Show progress bar again
    }, 10000); // 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [allHighlight, currentHighlightIndex, currentMediaIndex]);

  // Update progress bar every second
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 100 / 10; // Increase progress by 1/10th every second
        } else {
          setIsProgressBarVisible(false); // Hide progress bar immediately when it reaches 100%
          return 100;
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(progressInterval); // Cleanup interval on unmount
  }, []);

  // Navigate to next media
  const goToNextMedia = () => {
    const currentHighlight = allHighlight[currentHighlightIndex];
    if (currentMediaIndex < currentHighlight.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
      setProgress(0); // Reset progress bar
      setIsProgressBarVisible(true); // Show progress bar again
    }
  };

  // Navigate to previous media
  const goToPreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
      setProgress(0); // Reset progress bar
      setIsProgressBarVisible(true); // Show progress bar again
    }
  };

  // Close the media player and navigate back
  const handleClose = () => {
    navigate("/");
  };

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Display if no highlights are found
  if (!allHighlight || allHighlight.length === 0) {
    return <div>No highlights found.</div>;
  }

  // Get the current highlight and its media
  const currentHighlight = allHighlight[currentHighlightIndex];
  const currentMedia = currentHighlight.media[currentMediaIndex];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Progress bar at the top of the card */}
        {isProgressBarVisible && (
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Close button */}
        <button onClick={handleClose} className={styles.closeButton}>
          <IoClose />
        </button>

        {/* Highlight title */}
        <h2 className={styles.title}>{currentHighlight.title}</h2>

        {/* Media player and navigation buttons */}
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
            disabled={
              currentMediaIndex === currentHighlight.media.length - 1 &&
              currentHighlightIndex === allHighlight.length - 1
            }
            className={styles.navButton}
          >
            {">"}
          </button>
        </div>

        {/* Media indicator dots */}
        <div className={styles.mediaIndicator}>
          {currentHighlight.media.map((_, index) => (
            <span
              key={index}
              className={`${styles.indicatorDot} ${
                index === currentMediaIndex ? styles.active : ""
              }`}
            ></span>
          ))}
        </div>

        {/* Highlight indicator */}
        <div className={styles.highlightIndicator}>
          {allHighlight.map((_, index) => (
            <span
              key={index}
              className={`${styles.indicatorDot} ${
                index === currentHighlightIndex ? styles.active : ""
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightMedia;