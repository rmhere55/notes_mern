import React from "react";
import styles from "./EmptyCard.module.css";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className={styles.emptyCard}>
         <figure>
      <img src={imgSrc} alt="No notes" className={styles.image} />
      <p className={styles.message}>{message}</p>
      </figure>
    </div>
  );
};

export default EmptyCard;
