// src/components/FactBox/FactBox.jsx
// Rotating FactBox:
// - Shows a random fact for the current genre.
// - Automatically rotates facts every `rotateIntervalMs` milliseconds.
// - Uses a fade-out -> swap -> fade-in sequence for smooth transitions.
// - Respects prefers-reduced-motion (if user requests reduced motion, auto-rotation is disabled).
//
// To change the rotation interval: adjust the default `rotateIntervalMs` value below
// or pass a prop `rotateIntervalMs={45000}` from the parent.

import React, { useEffect, useRef, useState } from "react";

export default function FactBox({
  genre = "lofi",
  facts = {},
  rotateIntervalMs = 60000,
}) {
  // currently displayed fact text
  const [fact, setFact] = useState(() => {
    const list = facts[genre] || [];
    return list.length
      ? list[0]
      : "Facts will appear here for the selected genre.";
  });

  // visible flag for fade animation
  const [visible, setVisible] = useState(true);

  // refs to hold timer IDs so we can clean them reliably
  const intervalRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  // helper: pick a random fact for a genre
  const pickRandomFact = (g) => {
    const list = facts[g] || [];
    if (!list.length) return "No facts available for this genre.";
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  };

  // helper: swap fact with fade animation
  const swapFactWithFade = (newFact) => {
    // fade out
    setVisible(false);
    // after fade-out, change fact and fade in
    clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setFact(newFact);
      setVisible(true);
    }, 260); // matches transitions timing in transitions.css
  };

  // Effect: when genre changes, immediately show a random fact,
  // clear previous interval, and (re)start the rotation interval.
  useEffect(() => {
    // Immediately show a new fact for the new genre
    const initial = pickRandomFact(genre);
    swapFactWithFade(initial);

    // Respect user's reduced motion preference: do not auto-rotate if reduced-motion is requested
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // clear any existing interval and return early
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear previous interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start a new interval to rotate facts every rotateIntervalMs
    intervalRef.current = setInterval(() => {
      const next = pickRandomFact(genre);
      swapFactWithFade(next);
    }, rotateIntervalMs);

    // Cleanup on genre change / unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    };
    // Adding rotateIntervalMs to deps means changing the interval from parent will restart it.
  }, [genre, rotateIntervalMs, facts]);

  // Full cleanup if component unmounts (extra safety)
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  return (
    <div className="factbox" aria-live="polite" aria-atomic="true">
      <div className={`fade ${visible ? "in" : ""}`}>
        <p>{fact}</p>
      </div>
    </div>
  );
}
