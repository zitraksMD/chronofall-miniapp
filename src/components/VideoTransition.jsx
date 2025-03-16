import React from "react";
import rotateVideo from "@/Assets/rotate-video.mp4";
import styles from "./VideoTransition.module.scss";

const VideoTransition = ({ onEnd }) => {
  return (
    <div className={styles.videoContainer}>
      <video autoPlay muted onEnded={onEnd} className={styles.video}>
        <source src={rotateVideo} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
};

export default VideoTransition;
