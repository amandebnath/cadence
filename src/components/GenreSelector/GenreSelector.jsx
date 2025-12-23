// src/components/GenreSelector/GenreSelector.jsx
// A small presentational component that shows the three genre buttons.
// Props:
// - currentGenre (string) : the currently selected genre
// - onGenreChange (fn)    : function to call with the new genre when user selects it
//
// This file is standalone (doesn't import GenreButton.jsx) to keep the first step tiny.
// Later we can refactor each button into its own component.

import React from "react";

/**
 * GenreSelector
 * Renders three accessible buttons for genre selection.
 * Uses aria-pressed to indicate the selected state to assistive tech.
 */
export default function GenreSelector({
  currentGenre = "lofi",
  onGenreChange = () => {},
}) {
  // local list of genres to render (keeps UI order deterministic)
  const genres = [
    { id: "lofi", label: "Lo-Fi" },
    { id: "classical", label: "Classical" },
    { id: "blues", label: "Blues" },
  ];

  // handle keyboard selection (Enter/Space)
  const handleKey = (e, genreId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onGenreChange(genreId);
    }
  };

  return (
    <nav aria-label="Music genres" className="genre-selector">
      <h3 className="card-heading">Genres</h3>
      <div className="genre-buttons" role="tablist" aria-label="Genres">
        {genres.map((g) => {
          const isActive = currentGenre === g.id;
          return (
            <button
              key={g.id}
              // visual + semantic state
              aria-pressed={isActive}
              role="tab"
              aria-selected={isActive}
              // minimal styling relies on globals.css variables
              className={`genre-button ${isActive ? "active" : ""}`}
              onClick={() => onGenreChange(g.id)}
              onKeyDown={(e) => handleKey(e, g.id)}
            >
              {g.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
