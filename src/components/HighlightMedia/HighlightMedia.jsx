import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import styles from "./HighlightMedia.module.css";
import { IoClose } from "react-icons/io5";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import PuffLoader from "react-spinners/PuffLoader";

const HighlightMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(null);
  const [allHighlight, setAllHighlight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const fetchHighlightMedia = async () => {
      try {
        const response = await fetch(
          `https://kimiatoranj-api.liara.run/api/highlights/highlights/${id}/`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setHighlight(data);

        const highlightIndex = allHighlight.findIndex(
          (h) => h.id === parseInt(id)
        );
        if (highlightIndex !== -1) {
          setCurrentHighlightIndex(highlightIndex);
          setCurrentMediaIndex(0);
          setProgressKey((prev) => prev + 1);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightMedia();
  }, [id, allHighlight]);

  useEffect(() => {
    const fetchAllHighlightMedia = async () => {
      try {
        const response = await fetch(
          `https://kimiatoranj-api.liara.run/api/highlights/highlights/`
        );
        if (!response.ok) throw new Error("Network response was not ok");
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

  useEffect(() => {
    if (allHighlight.length === 0) return;
    const interval = setInterval(() => {
      goToNextMedia();
    }, 10000);
    return () => clearInterval(interval);
  }, [allHighlight, currentHighlightIndex, currentMediaIndex]);

  const goToNextMedia = () => {
    const currentHighlight = allHighlight[currentHighlightIndex];
    if (currentMediaIndex < currentHighlight.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else {
      setCurrentHighlightIndex((prevIndex) =>
        prevIndex < allHighlight.length - 1 ? prevIndex + 1 : 0
      );
      setCurrentMediaIndex(0);
    }
    setProgressKey((prev) => prev + 1);
  };

  const goToPreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    } else {
      setCurrentHighlightIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : allHighlight.length - 1
      );
      setCurrentMediaIndex(
        allHighlight[currentHighlightIndex].media.length - 1
      );
    }
    setProgressKey((prev) => prev + 1);
  };

  const handleClose = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <PuffLoader color="#ffed00" size={65} />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!allHighlight || allHighlight.length === 0)
    return <div>No highlights found.</div>;

  const currentHighlight = allHighlight[currentHighlightIndex];
  const currentMedia = currentHighlight.media[currentMediaIndex];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div key={progressKey} className={styles.progressBarContainer}>
          <div className={styles.progressBar}></div>
        </div>

        <button onClick={handleClose} className={styles.closeButton}>
          <IoClose />
        </button>

        <h2 className={styles.title}>{currentHighlight.title}</h2>

        {/* Media with navigation for desktop */}
        <div className={styles.mediaWrapper}>
          <button
            onClick={goToPreviousMedia}
            disabled={currentMediaIndex === 0}
            className={styles.navButton}
          >
            <GrFormPrevious />
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
            <GrFormNext />
          </button>
        </div>

        {/* Mobile navigation below image */}
        <div className={styles.mobileNavButtons}>
          <button
            onClick={goToPreviousMedia}
            disabled={currentMediaIndex === 0}
            className={styles.navButton}
          >
            <GrFormPrevious />
          </button>
          <button
            onClick={goToNextMedia}
            disabled={
              currentMediaIndex === currentHighlight.media.length - 1 &&
              currentHighlightIndex === allHighlight.length - 1
            }
            className={styles.navButton}
          >
            <GrFormNext />
          </button>
        </div>

     {/* فقط نشانگر مدیاهای هایلایت فعلی نمایش داده می‌شود */}
{/* <div className={styles.mediaIndicator}>
  {currentHighlight.media.map((_, index) => (
    <span
      key={index}
      className={`${styles.indicatorDot} ${
        index === currentMediaIndex ? styles.active : ""
      }`}
    ></span>
  ))}
</div> */}


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
