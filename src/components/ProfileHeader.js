import React from "react";
import { urls } from "../styles/theme";
import styles from "../styles/ProfileHeader.module.css";

export default function ProfileHeader() {
  return (
    <div className={styles.header}>
      <img
        src={urls.profile}
        alt="Daniel Creed Profile"
        className={styles.profileImage}
      />
      <div>
        <h2 className={styles.title}>
          Daniel Creed Q&amp;A ChatBot
        </h2>
      </div>
      <img
        src={urls.badge}
        alt="Goon Badge"
        className={styles.badgeImage}
      />
    </div>
  );
}
