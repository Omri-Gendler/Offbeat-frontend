import { useEffect, useState, useCallback } from "react";
import { IconPlay24, IconPause24 } from "./Icon.jsx";

export function PlayPauseButton({
  // Controlled value (optional). If provided, the button mirrors this prop.
  isPlaying,
  // Uncontrolled initial value (used only when isPlaying is undefined)
  defaultPressed = false,

  onPlay,           // called when switching to "playing"
  onPause,          // called when switching to "paused"
  onToggle,         // optional: onToggle(nextBoolean)

  disabled = false,
  className = "station-actions-play-btn",
  tabIndex = 0,
  ariaPlay = "Play",
  ariaPause = "Pause",
  ...rest
}) {
  const isControlled = typeof isPlaying === "boolean";
  const [localPressed, setLocalPressed] = useState(!!defaultPressed);

  // keep local state synced if the parent switches between controlled/uncontrolled
  useEffect(() => {
    if (isControlled) setLocalPressed(!!isPlaying);
  }, [isControlled, isPlaying]);

  const pressed = isControlled ? !!isPlaying : localPressed;

  const commit = useCallback(
    (next) => {
      if (!isControlled) setLocalPressed(next);
      onToggle?.(next);
      next ? onPlay?.() : onPause?.();
    },
    [isControlled, onPlay, onPause, onToggle]
  );

  const handleActivate = useCallback(() => {
    if (disabled) return;
    commit(!pressed);
  }, [disabled, pressed, commit]);

  const handleKeyDown = (e) => {
    if (disabled) return;
    // Space or Enter should activate the control
    if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-pressed={pressed}
      aria-label={pressed ? ariaPause : ariaPlay}
      data-playing={pressed ? "true" : "false"}
      tabIndex={tabIndex}
      disabled={disabled}
      {...rest}
    >
      {pressed ? <IconPause24 /> : <IconPlay24 />}
    </button>
  );
}
