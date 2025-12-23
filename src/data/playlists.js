// This file stores the metadata for all tracks in all genres.
// Updates will be made to the "src" paths once the real audio files are placed in assets/audio/<genre>.

/*
    IMPORTANT:
    Each track object MUST have:
    - id: unique identifier
    - title: name of the track
    - artist: track creator / placeholder
    - src: path to the audio file
    - thumb: image for album art (can be same per genre)
*/

// Lofi
import lofi1 from "../assets/audio/lofi/lofi-01.mp3";
import lofi2 from "../assets/audio/lofi/lofi-02.mp3";
import lofi3 from "../assets/audio/lofi/lofi-03.mp3";

// Classical
import classical1 from "../assets/audio/classical/classical-01.mp3";
import classical2 from "../assets/audio/classical/classical-02.mp3";
import classical3 from "../assets/audio/classical/classical-03.mp3";

// Blues
import blues1 from "../assets/audio/blues/blues-01.mp3";
import blues2 from "../assets/audio/blues/blues-02.mp3";
import blues3 from "../assets/audio/blues/blues-03.mp3";

export const playlists = {
  lofi: [
    {
      id: 1,
      title: "Last Summer",
      artist: "HoliznaPATREON",
      album: "Lo-Fi",
      license:
        "Attribution-NonCommercial-NoDerivatives 4.0 International License.",
      src: lofi1,
      thumb: "/src/assets/audio/lofi/lofi-thumb-1.jpg",
    },

    {
      id: 2,
      title: "3 AM",
      artist: "HoliznaPATREON",
      album: "Lo-Fi",
      license:
        "Attribution-NonCommercial-NoDerivatives 4.0 International License.",
      src: lofi2,
      thumb: "/src/assets/audio/lofi/lofi-thumb-2.jpg",
    },

    {
      id: 3,
      title: "Artificial Rain",
      artist: "Lo-Fi Astronaut",
      album: "Lo-Fi And Beyond",
      license: "Attribution 4.0 International License.",
      src: lofi3,
      thumb: "/src/assets/audio/lofi/lofi-thumb-3.jpg",
    },
  ],

  classical: [
    {
      id: 1,
      title: "Orchestra 3",
      artist: "Magenta Six",
      album: "Orchestra",
      license: "Attribution 4.0 International License.",
      src: classical1,
      thumb: "/src/assets/audio/classical/classical-thumb-1.jpg",
    },

    {
      id: 2,
      title: "Crush Point",
      artist: "The OO-Ray",
      album: "Empty Orchestra",
      license: "Attribution-NonCommercial License.",
      src: classical2,
      thumb: "/src/assets/audio/classical/classical-thumb-2.jpg",
    },

    {
      id: 3,
      title: "Our Wasted Summer",
      artist: "The OO-Ray",
      album: "Empty Orchestra",
      license: "Attribution-NonCommercial License.",
      src: classical3,
      thumb: "/src/assets/audio/classical/classical-thumb-3.jpg",
    },
  ],

  blues: [
    {
      id: 1,
      title: "The Message",
      artist: "F J Blues",
      album: "The Unknown Man",
      license:
        "Attribution-NonCommercial-NoDerivatives 4.0 International License.",
      src: blues1,
      thumb: "/src/assets/audio/blues/blues-thumb-1.jpg",
    },

    {
      id: 2,
      title: "Dirt Rhodes",
      artist: "Kevin MacLeod",
      album: "Blues Sampler",
      license: "Creative Commons Attribution License.",
      src: blues2,
      thumb: "/src/assets/audio/blues/blues-thumb-2.jpg",
    },

    {
      id: 3,
      title: "Rebel Blues",
      artist: "Sul Rebel",
      album: "Single",
      license: "Attribution-NonCommercial License.",
      src: blues3,
      thumb: "/src/assets/audio/blues/blues-thumb-3.jpg",
    },
  ],
};
