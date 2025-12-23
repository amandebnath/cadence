// src/components/Player/Player.jsx
// Enhanced Player with:
// - audio element management (play/pause)
// - Prev / Next buttons that call parent callbacks
// - clickable progress bar (seek) and time display
// - emits onTrackEnd to parent when audio ends
//
// Props:
// - playlist (array) : array of track objects
// - trackIndex (number) : index of the currently selected track in playlist
// - onTrackEnd (fn) : called when a track finishes playing
// - onNext (fn) : called when user clicks Next
// - onPrev (fn) : called when user clicks Prev

import React, { useEffect, useRef, useState } from "react";

export default function Player({
  playlist = [],
  trackIndex = 0,
  onTrackEnd = () => {},
  onNext = () => {},
  onPrev = () => {},
  autoPlayOnChange = false,
}) {
  const audioRef = useRef(null);
  const shouldAutoPlayRef = useRef(false);

  // UI state:
  const [isPlaying, setIsPlaying] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [volume, setVolume] = useState(0.8); // NEW
  const [isMuted, setIsMuted] = useState(false); // NEW
  const lastVolumeRef = useRef(0.8); // NEW

  // Progress state:
  const [duration, setDuration] = useState(0); // seconds
  const [currentTime, setCurrentTime] = useState(0); // seconds

  // Cross-fade state for albums art:
  // Toggles image element visibility (0 or 1)
  const [visibleImg, setVisibleImg] = useState(0);
  const imgRefs = [useRef(null), useRef(null)];

  // Current track derived
  const currentTrack = playlist[trackIndex] || null;

  const handleToggleMute = () => {
    if (isMuted) {
      setVolume(lastVolumeRef.current || 0.8);
      setIsMuted(false);
    } else {
      lastVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
  };

  // Initialize audio element once

  // volume state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";

      // update time updates
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current.currentTime || 0);
      });

      // when metadata loaded, set duration
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration || 0);
      });

      // when track ends - enable auto-play for the next track and notify parent
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        // ensure the next track will auto-play when the parent updates trackIndex
        shouldAutoPlayRef.current = true;
        onTrackEnd();
      });
    }

    // cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload helper for images
  const preloadImage = (src) =>
    new Promise((resolve) => {
      if (!src) return resolve();
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });

  // When trackIndex changes and autoPlayOnChange is true, enable auto-play
  useEffect(() => {
    if (autoPlayOnChange) {
      shouldAutoPlayRef.current = true;
    }
  }, [trackIndex, autoPlayOnChange]);

  // When currentTrack changes: swap audio.src with a small fade
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    // fade out
    setInfoVisible(false);
    // Pause current audio and reset playing state when track changes
    audioRef.current.pause();
    setIsPlaying(false);

    const t = setTimeout(async () => {
      // swap audio
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();

      // preload the new thumbnail
      await preloadImage(currentTrack.thumb);

      // toggle visible image index for cross-fade
      setVisibleImg((v) => (v === 0 ? 1 : 0));

      // reset progress UI
      setCurrentTime(0);
      setDuration(0);

      // Set playing state based on shouldAutoPlayRef
      // The play/pause effect will handle the actual playback
      if (shouldAutoPlayRef.current) {
        shouldAutoPlayRef.current = false;
        // Set playing state - play/pause effect will handle playback and wait for audio to be ready
        setIsPlaying(true);
      }

      setInfoVisible(true);
    }, 180);

    return () => clearTimeout(t);
  }, [currentTrack]);

  // Play/pause effect
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Try to play - if audio isn't ready, it will be handled by the canplay listener
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play failed, likely because audio isn't ready yet
          // Wait for canplay event
          const onCanPlay = () => {
            audioRef.current.play().catch(() => setIsPlaying(false));
            audioRef.current.removeEventListener("canplay", onCanPlay);
          };
          audioRef.current.addEventListener("canplay", onCanPlay);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, trackIndex]); // <-- IMPORTANT

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input field
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Prevent default for our shortcuts
      switch (e.key) {
        case " ": // Space - Play/Pause
          e.preventDefault();
          if (currentTrack) {
            setIsPlaying((s) => !s);
          }
          break;

        case "ArrowRight": // Seek +5 seconds
          e.preventDefault();
          if (audioRef.current && duration) {
            const newTime = Math.max(
              0,
              Math.min(duration, audioRef.current.currentTime + 5)
            );
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
          }
          break;

        case "ArrowLeft": // Seek -5 seconds
          e.preventDefault();
          if (audioRef.current && duration) {
            const newTime = Math.max(
              0,
              Math.min(duration, audioRef.current.currentTime - 5)
            );
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
          }
          break;

        case "ArrowUp": // Volume +5%
          e.preventDefault();
          setVolume((v) => {
            const newVol = Math.max(0, Math.min(1, v + 0.05));
            setIsMuted(newVol === 0);
            return newVol;
          });
          break;

        case "ArrowDown": // Volume -5%
          e.preventDefault();
          setVolume((v) => {
            const newVol = Math.max(0, Math.min(1, v - 0.05));
            setIsMuted(newVol === 0);
            return newVol;
          });
          break;

        case "m":
        case "M": // Mute/Unmute
          e.preventDefault();
          if (isMuted) {
            setVolume(lastVolumeRef.current || 0.8);
            setIsMuted(false);
          } else {
            lastVolumeRef.current = volume;
            setVolume(0);
            setIsMuted(true);
          }
          break;

        case "n":
        case "N": // Next track
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.pause();
          }
          shouldAutoPlayRef.current = true;
          onNext();
          break;

        case "p":
        case "P": // Previous track
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.pause();
          }
          shouldAutoPlayRef.current = true;
          onPrev();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTrack, duration, isMuted, volume, onNext, onPrev]); // Dependencies

  // Handler: toggle play/pause
  const handleTogglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying((s) => !s);
  };

  // Handler: user clicked prev (notify parent)
  const handlePrev = () => {
    // stop current playback
    if (audioRef.current) {
      audioRef.current.pause();
    }
    shouldAutoPlayRef.current = true;
    onPrev();
  };

  // Handler: user clicked next (notify parent)
  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    shouldAutoPlayRef.current = true;
    onNext();
  };

  // Format seconds -> mm:ss
  const formatTime = (sec = 0) => {
    if (!isFinite(sec) || sec <= 0) return "0:00";
    const s = Math.floor(sec % 60);
    const m = Math.floor(sec / 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Click/seek on progress bar
  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    // compute click position relative to element
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const pct = Math.max(0, Math.min(1, clickX / width));
    const newTime = pct * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // If no track, show friendly message
  if (!currentTrack) {
    return (
      <div className="player-root">
        <p>No track loaded for this genre yet.</p>
      </div>
    );
  }

  // compute progress percent for UI
  const progressPct = duration
    ? Math.min(100, (currentTime / duration) * 100)
    : 0;

  // compute the two image srcs for the stacked images
  const imgSrcs = [null, null];
  // visibleImg determines which elements is currently visible;
  imgSrcs[visibleImg] = currentTrack.thumb; // the visible elements shows current thumb

  return (
    <div className="player-root" role="region" aria-label="Music player">
      {/* Album art with cross-fade */}
      <div
        className="album-art"
        style={{
          marginRight: 18,
        }} /* kept local spacing; move to CSS if desired */ /* KEPT */
      >
        <div
          className="cross-fade"
          style={{ width: 220, height: 220, position: "relative" }} /* KEPT */
        >
          {/* Image 0 */}
          <img
            ref={imgRefs[0]}
            src={imgSrcs[0]}
            alt={`${currentTrack.title} album art`}
            className={visibleImg === 0 ? "visible" : ""}
            style={{
              width: 220,
              height: 220,
              objectFit: "cover",
              borderRadius: 8,
            }} /* KEPT */
            draggable={false} /* ADDED: avoid dragging album art */ /* ADDED */
          />
          {/* Image 1 */}
          <img
            ref={imgRefs[1]}
            src={imgSrcs[1]}
            alt={`${currentTrack.title} album art`}
            className={visibleImg === 1 ? "visible" : ""}
            style={{
              width: 220,
              height: 220,
              objectFit: "cover",
              borderRadius: 8,
            }} /* KEPT */
            draggable={false} /* ADDED: avoid dragging album art */ /* ADDED */
          />
        </div>
      </div>

      {/* Info + controls column */}
      <div style={{ flex: 1 }}>
        {/* Track info */}
        <div className={`track-info fade ${infoVisible ? "in" : ""}`}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {currentTrack.title}
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            {currentTrack.artist}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16 }}>
          <div
            className="progress-bar"
            style={{
              height: 10,
              background: "rgba(0,0,0,0.06)",
              borderRadius: 999,
              overflow: "hidden",
              cursor: duration ? "pointer" : "default",
            }}
            onClick={handleSeek}
            aria-label="Seek bar"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: "var(--accent-color)",
                transition: "width 180ms linear",
              }}
            />
          </div>

          {/* time labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: 13,
            }}
          >
            <div>{formatTime(currentTime)}</div>
            <div>{formatTime(duration)}</div>
          </div>
        </div>

        {/* Controls */}
        {/* Transport controls */}
        <div className="controls">
          {" "}
          {/* UPDATED: transport row only */}
          <button
            className="prev"
            onClick={handlePrev}
            aria-label="Previous track"
            onMouseDown={(e) => e.preventDefault()} // keep
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon
                points="19 20 9 12 19 4 19 20"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="5"
                y1="19"
                x2="5"
                y2="5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </button>
          <button
            className={`play ${isPlaying ? "playing" : ""}`}
            onClick={handleTogglePlay}
            aria-pressed={isPlaying}
            onMouseDown={(e) => e.preventDefault()} // keep
          >
            {isPlaying ? (
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="6"
                  y="4"
                  width="4"
                  height="16"
                  vectorEffect="non-scaling-stroke"
                />
                <rect
                  x="14"
                  y="4"
                  width="4"
                  height="16"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            ) : (
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon
                  points="5 3 19 12 5 21 5 3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
          </button>
          <button
            className="next"
            onClick={handleNext}
            aria-label="Next track"
            onMouseDown={(e) => e.preventDefault()} // keep
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon
                points="5 4 15 12 5 20 5 4"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="19"
                y1="5"
                x2="19"
                y2="19"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </button>
        </div>

        {/* Volume row (NEW ROW, full width) */}
        <div className="volume-row">
          {" "}
          {/* UPDATED: separate row */}
          <button
            className={`volume-btn ${isMuted ? "muted" : ""}`}
            onClick={handleToggleMute}
            aria-label="Mute"
            onMouseDown={(e) => e.preventDefault()} // ADDED
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="currentColor" // FIX
              stroke="currentColor" // FIX
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon
                points="5 9 9 9 13 5 13 19 9 15 5 15"
                vectorEffect="non-scaling-stroke"
              />
              {isMuted && (
                <>
                  <line
                    x1="16"
                    y1="8"
                    x2="21"
                    y2="16"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1="21"
                    y1="8"
                    x2="16"
                    y2="16"
                    vectorEffect="non-scaling-stroke"
                  />
                </>
              )}
            </svg>
          </button>
          <input
            className="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}
