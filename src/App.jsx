// App skeleton that wires playlists + facts and exposes genre state.

import Player from "./components/Player/Player.jsx";
import GenreSelector from "./components/GenreSelector/GenreSelector.jsx";
import React, { useState, useEffect, useRef } from "react";
import { playlists } from "./data/playlists"; // playlist metadata
import factsData from "./data/facts.json"; // genre-based facts
import FactBox from "./components/FactBox/FactBox.jsx";
import MainCard from "./components/Layout/MainCard.jsx";

// App-level styles
import "./styles/globals.css";
import "./styles/transitions.css";

/**
 * App
 * - Manages top-level state: currentGenre, currentTrackIndex, is Playing
 * - Applies theme class to <body> when genre changes
 * - Renders simple placeholders for future components
 */

export default function App() {
  // Top-level state
  const [currentGenre, setCurrentGenre] = useState("lofi"); // default genre
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const imageCacheRef = useRef({});
  const timersRef = useRef({ crossfade: null, finish: null });
  // const [isPlaying, setIsPlaying] = useState(false);

  // Derived data: current playlist and current fact list
  const currentPlaylist = playlists[currentGenre] || [];

  useEffect(() => {
    // mapping of genre -> image url (adjust paths if your images are elsewhere)
    const BG = {
      lofi: "url('/src/assets/img/lofi-bg.jp",
      classical: "url('/src/assets/img/classical-bg.jpg')",
      blues: "url('/src/assets/img/blues-bg.jpg')",
    };

    const genre = String(currentGenre || "lofi").toLowerCase();
    const newBg = BG[genre] || BG.lofi;

    // simple image cache + timers storage
    const imgCache = imageCacheRef.current;
    const timers = timersRef.current;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // utility to extract src from url('...') or pass through
    const srcMatch = newBg.match(/url\\(['"]?(.*?)['"]?\\)/);
    const imgSrc = srcMatch ? srcMatch[1] : newBg;

    const cur = getComputedStyle(document.body)
      .getPropertyValue("--bg-current")
      .trim();
    if (!cur || cur === "none" || cur === "") {
      // Set initial background image
      document.body.style.setProperty("--bg-current", `url('${imgSrc}')`);
      document.body.style.removeProperty("--bg-next");
      document.body.classList.forEach((c) => {
        if (c.startsWith("theme-")) document.body.classList.remove(c);
      });
      document.body.classList.add("theme-" + genre);
      return;
    }

    const clearTimers = () => {
      if (timers.crossfade) clearTimeout(timers.crossfade);
      if (timers.finish) clearTimeout(timers.finish);
      timers.crossfade = null;
      timers.finish = null;
    };

    // preload image (cached)
    if (!imgCache[imgSrc]) {
      const i = new Image();
      i.src = imgSrc;
      imgCache[imgSrc] = i;
    }
    const img = imgCache[imgSrc];

    const startCrossfade = () => {
      if (prefersReduced) {
        clearTimers();
        document.body.style.setProperty("--bg-current", `url('${imgSrc}')`);
        document.body.style.removeProperty("--bg-next");
        document.body.classList.forEach((c) => {
          if (c.startsWith("theme-")) document.body.classList.remove(c);
        });
        document.body.classList.add("theme-" + genre);
        return;
      }

      // Remove crossfade class to reset state
      document.body.classList.remove("bg-crossfade");

      // Set the new background image on the next layer FIRST
      document.body.style.setProperty("--bg-next", `url('${imgSrc}')`);

      // Update theme class
      document.body.classList.forEach((c) => {
        if (c.startsWith("theme-")) document.body.classList.remove(c);
      });
      document.body.classList.add("theme-" + genre);

      // Read duration from CSS var
      const durStr =
        getComputedStyle(document.body)
          .getPropertyValue("--bg-crossfade-duration")
          .trim() || "2500ms";
      const dur = parseFloat(durStr) || 2500;

      clearTimers();

      // Force a reflow to ensure CSS variable is set
      void document.body.offsetWidth;

      // Start the crossfade - use setTimeout with 0ms to ensure browser has processed the CSS change
      timers.crossfade = setTimeout(() => {
        document.body.classList.add("bg-crossfade");
      }, 10);

      // After transition completes, swap the images and reset
      timers.finish = setTimeout(() => {
        document.body.style.setProperty("--bg-current", `url('${imgSrc}')`);
        document.body.style.removeProperty("--bg-next");
        document.body.classList.remove("bg-crossfade");
        clearTimers();
      }, dur + 50);
    };

    if (img.complete) {
      startCrossfade();
    } else {
      const onLoad = () => {
        startCrossfade();
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };
      const onError = () => {
        startCrossfade();
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
    }

    return () => {
      clearTimers();
    };
  }, [currentGenre]);

  // Basic handlers
  const handleGenreChange = (genre) => {
    if (genre === currentGenre) return;
    setCurrentGenre(genre);
    setCurrentTrackIndex(0);
  };

  // Advance to the next track
  const handleNext = () => {
    const playlist = playlists[currentGenre] || [];
    if (!playlist.length) return;
    setCurrentTrackIndex((i) => {
      const next = i + 1 < playlist.length ? i + 1 : 0;
      return next;
    });
  };

  // Go to previous track
  const handlePrev = () => {
    const playlist = playlists[currentGenre] || [];
    if (!playlist.length) return;
    setCurrentTrackIndex((i) => {
      const prev = i - 1 >= 0 ? i - 1 : playlist.length - 1;
      return prev;
    });
  };

  // const togglePlay = () => setIsPlaying((p) => !p);

  // Render minimal layout placeholders only
  return (
    <MainCard
      playlists={playlists}
      currentGenre={currentGenre}
      onGenreChange={handleGenreChange}
      currentPlaylist={currentPlaylist}
      currentTrackIndex={currentTrackIndex}
      setCurrentTrackIndex={setCurrentTrackIndex}
      handleNext={handleNext}
      handlePrev={handlePrev}
      factsData={factsData}
    />
  );
}
