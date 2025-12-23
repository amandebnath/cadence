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
import lofiThumb1 from "../assets/audio/lofi/lofi-thumb-1.jpg";
import lofiThumb2 from "../assets/audio/lofi/lofi-thumb-2.jpg";
import lofiThumb3 from "../assets/audio/lofi/lofi-thumb-3.jpg";

// Classical
import classical1 from "../assets/audio/classical/classical-01.mp3";
import classical2 from "../assets/audio/classical/classical-02.mp3";
import classical3 from "../assets/audio/classical/classical-03.mp3";
import classicalThumb1 from "../assets/audio/classical/classical-thumb-1.jpg";
import classicalThumb2 from "../assets/audio/classical/classical-thumb-2.jpg";
import classicalThumb3 from "../assets/audio/classical/classical-thumb-3.jpg";

// Blues
import blues1 from "../assets/audio/blues/blues-01.mp3";
import blues2 from "../assets/audio/blues/blues-02.mp3";
import blues3 from "../assets/audio/blues/blues-03.mp3";
import bluesThumb1 from "../assets/audio/blues/blues-thumb-1.jpg";
import bluesThumb2 from "../assets/audio/blues/blues-thumb-2.jpg";
import bluesThumb3 from "../assets/audio/blues/blues-thumb-3.jpg";

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
      thumb: lofiThumb1,
    },

    {
      id: 2,
      title: "3 AM",
      artist: "HoliznaPATREON",
      album: "Lo-Fi",
      license:
        "Attribution-NonCommercial-NoDerivatives 4.0 International License.",
      src: lofi2,
      thumb: lofiThumb2,
    },

    {
      id: 3,
      title: "Artificial Rain",
      artist: "Lo-Fi Astronaut",
      album: "Lo-Fi And Beyond",
      license: "Attribution 4.0 International License.",
      src: lofi3,
      thumb: lofiThumb3,
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
      thumb: classicalThumb1,
    },

    {
      id: 2,
      title: "Crush Point",
      artist: "The OO-Ray",
      album: "Empty Orchestra",
      license: "Attribution-NonCommercial License.",
      src: classical2,
      thumb: classicalThumb2,
    },

    {
      id: 3,
      title: "Our Wasted Summer",
      artist: "The OO-Ray",
      album: "Empty Orchestra",
      license: "Attribution-NonCommercial License.",
      src: classical3,
      thumb: classicalThumb3,
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
      thumb: bluesThumb1,
    },

    {
      id: 2,
      title: "Dirt Rhodes",
      artist: "Kevin MacLeod",
      album: "Blues Sampler",
      license: "Creative Commons Attribution License.",
      src: blues2,
      thumb: bluesThumb2,
    },

    {
      id: 3,
      title: "Rebel Blues",
      artist: "Sul Rebel",
      album: "Single",
      license: "Attribution-NonCommercial License.",
      src: blues3,
      thumb: bluesThumb3,
    },
  ],
};
