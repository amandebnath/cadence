// src/components/Layout/MainCard.jsx
// Single centered glass card that contains:
// Left column: Genres + Track list
// Middle column: Player (album art, progress, controls, credits)
// Right column: FactBox
//
// This component intentionally *reuses* your existing components:
// - GenreSelector (handles genre switching)
// - Player (handles audio controls)
// - FactBox (rotating genre facts)
//
// Props expected from App (we pass these when rendering):
// - playlists, currentGenre, setCurrentGenre, currentPlaylist
// - currentTrackIndex, setCurrentTrackIndex, handleNext, handlePrev
// - factsData
//
// If you named handlers differently in App.jsx, keep names consistent
// when you call this component in the next step.

import React, { useState, useEffect } from "react";
import GenreSelector from "../GenreSelector/GenreSelector.jsx";
import Player from "../Player/Player.jsx";
import FactBox from "../FactBox/FactBox.jsx";
import Footer from "../Footer/Footer.jsx";

export default function MainCard(props) {
  const {
    playlists,
    currentGenre,
    onGenreChange,
    currentPlaylist,
    currentTrackIndex,
    setCurrentTrackIndex,
    handleNext,
    handlePrev,
    factsData,
  } = props;

  const [autoPlayOnChange, setAutoPlayOnChange] = useState(false);

  const currentTrack =
    currentPlaylist && currentPlaylist[currentTrackIndex]
      ? currentPlaylist[currentTrackIndex]
      : null;

  // Reset autoPlayOnChange after trackIndex changes
  useEffect(() => {
    if (autoPlayOnChange) {
      // Reset after a short delay to allow Player to process it
      const timer = setTimeout(() => {
        setAutoPlayOnChange(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentTrackIndex, autoPlayOnChange]);

  return (
    <div className="main-card-outer">
      <header className="app-header">
        <img
          src="/cadence-logo.png"
          alt="Cadence - Music For Focus"
          className="app-logo"
          draggable={false}
        />
      </header>
      <div className="main-card">
        {/* LEFT: Genres + Tracklist */}
        <aside className="card-left">
          <GenreSelector
            genres={[
              { id: "lofi", label: "Lo-Fi" },
              { id: "classical", label: "Classical" },
              { id: "blues", label: "Blues" },
            ]}
            currentGenre={currentGenre}
            onGenreChange={onGenreChange}
          />

          <div className="track-list">
            <h4 className="card-heading">Track List</h4>
            <ol>
              {currentPlaylist && currentPlaylist.length ? (
                currentPlaylist.map((t, i) => (
                  <li
                    key={t.src || i}
                    className={i === currentTrackIndex ? "active" : ""}
                  >
                    <button
                      onClick={() => {
                        setAutoPlayOnChange(true);
                        setCurrentTrackIndex(i);
                      }}
                    >
                      {t.title || `Track ${i + 1}`}
                      <span className="small-artist">
                        {t.artist ? ` — ${t.artist}` : ""}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li>No tracks</li>
              )}
            </ol>
          </div>
        </aside>

        {/* MIDDLE: Player */}
        <main className="card-center">
          <Player
            playlist={currentPlaylist}
            trackIndex={currentTrackIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            onTrackEnd={handleNext}
            autoPlayOnChange={autoPlayOnChange}
          />
        </main>

        {/* RIGHT: Factbox + Credits stacked */}
        <aside className="card-right">
          <div className="fact-card">
            <h4 className="card-heading">Did You Know?</h4>
            <FactBox genre={currentGenre} facts={factsData} />
          </div>

          <div className="credits-card">
            <h4 className="card-heading">Music Credits</h4>
            <div className="credits-content">
              {currentTrack ? (
                <>
                  <p>
                    <strong>Track Title:</strong> {currentTrack.title}
                  </p>
                  <p>
                    <strong>Artist:</strong> {currentTrack.artist}
                  </p>
                  <p>
                    <strong>Album:</strong> {currentTrack.album}
                  </p>
                  <p>
                    <strong>License:</strong> {currentTrack.license}
                  </p>
                </>
              ) : (
                <small>Music credits and source info will appear here.</small>
              )}
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
