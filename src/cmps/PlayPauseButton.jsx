// PlayPauseButton.jsx
import { useState } from "react";
import { IconPlay24, IconPause24 } from "./Icon.jsx";

export function PlayPauseButton({
  defaultPressed = false,
  onPlay,           // optional callback when it switches to "playing"
  onPause,          // optional callback when it switches to "paused"
  className = "station-actions-play-btn",
  tabIndex = 0,     // make it focusable (change to -1 if you really want)
  ariaPlay = "Play",
  ariaPause = "Pause",
}) {
  const [pressed, setPressed] = useState(defaultPressed);

  const handleClick = () => {
    setPressed(prev => {
      const next = !prev;
      next ? onPlay?.() : onPause?.();
      return next;
    });
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      aria-pressed={pressed}
      aria-label={pressed ? ariaPause : ariaPlay}
      data-playing={pressed ? "true" : "false"}
      tabIndex={tabIndex}
      type="button"
    >
      {pressed ? <IconPause24 /> : <IconPlay24 />}
    </button>
  );
}
