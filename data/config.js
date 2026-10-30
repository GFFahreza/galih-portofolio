/*
  Site settings. Leave a value as "" to hide it.

  github:    full URL, e.g. "https://github.com/your-username"
  linkedin:  full URL, e.g. "https://www.linkedin.com/in/your-handle"
  portfolio: full URL of another portfolio page, if any (shown on the CV)
  email:     plain address, e.g. "name@example.com" (footer only, never on the CV)

  photo:     path to a portrait shown in the hero, e.g. "assets/photo.jpg".
             Portrait orientation works best (it is cropped to 4:5).
  photoAlt:  short description of the photo for screen readers.

  cvPdf:     path to a public-safe CV PDF, e.g. "assets/cv/Galih-Fajar-Fahreza-CV.pdf".
             The "Download CV (PDF)" button appears as soon as this is set.
             Remove your phone number and email from the PDF before you add it.

  video:     the "Meet me" introduction video. While both id and src are "",
             the frame shows its "Introduction video coming soon" state.
    provider: "youtube" (use an Unlisted video) or "file" (an mp4 in assets/video/)
    id:       the YouTube video ID, the 11 characters after "watch?v=" in the link
    src:      path to the mp4 when provider is "file", e.g. "assets/video/intro.mp4"
    poster:   optional poster image path; without it, a designed poster is shown
    title:    accessible name of the player (the section heading is the visible title)
    captions: optional .vtt subtitle path (provider "file" only)
*/
window.CONFIG = {
  github: "",
  linkedin: "",
  portfolio: "",
  email: "",

  photo: "",
  photoAlt: "Portrait of Galih Fajar Fahreza",

  cvPdf: "",

  video: {
    provider: "youtube",
    id: "",
    src: "",
    poster: "",
    title: "Self-introduction by Galih Fajar Fahreza",
    captions: ""
  }
};
