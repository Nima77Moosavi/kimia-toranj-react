import React, { useEffect, useState } from "react";
import HighlightCard from "../HighlightCard/HighlightCard";
import styles from "./Highlights.module.css"; // Import the CSS module
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import PropagateLoader from "react-spinners/PropagateLoader"

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/highlights/highlights/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHighlights(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (loading) {
    return <div><PropagateLoader color="#fde50a" size={20} /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const scrollLeft = () => {
    document
      .querySelector(`.${styles.highlightsContainer}`)
      .scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    document
      .querySelector(`.${styles.highlightsContainer}`)
      .scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className={styles.highlightsWrapper}>
      <button onClick={scrollLeft} className={styles.scrollButton}>
      <GrFormPrevious />
      </button>
      <div className={styles.highlightsContainer}>
        <div className={styles.highlights}>
          {highlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>
      </div>
      <button onClick={scrollRight} className={styles.scrollButton}>
      <GrFormNext />
      </button>
    </div>
  );
};

export default Highlights;
