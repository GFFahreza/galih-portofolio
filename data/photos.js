/*
  Photo slots. Every image on the site comes from here.
  While `src` is "", the slot shows a designed placeholder with the target
  path, the recommended size, and the caption idea. Fill `src` with the file
  path once the photo is in place (see assets/images/README.md for the rules).
  Set `hidden: true` to drop a slot you do not need.

  { id, src, alt, caption, ratio, spec, path, width, height, position, hidden }
  - position: CSS object-position, to keep a face in frame (e.g. "50% 30%")
  - ratio:  CSS aspect ratio, e.g. "4 / 5"
  - path:   where the file should go (shown in the placeholder)
  - width/height: the real pixel size of your file once you add it
*/
window.PHOTOS = [
  { id: "portrait", src: "assets/images/profile/foto-diri.jpg", alt: "Portrait of Galih Fajar Fahreza", caption: "", ratio: "4 / 5", spec: "1200 x 1500", path: "assets/images/profile/foto-diri.jpg", width: 572, height: 729, position: "50% 30%" },
  { id: "cv-photo", src: "assets/images/profile/foto-diri.jpg", alt: "Portrait of Galih Fajar Fahreza", caption: "", ratio: "3 / 4", spec: "600 x 800", path: "assets/images/profile/foto-diri.jpg", width: 572, height: 729, position: "50% 25%" },

  { id: "edm-01", group: "edm", src: "", alt: "Galih arriving in the Mentawai Islands with the EDM team", caption: "Arriving with the team", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/edm/edm-01.jpg", width: 1600, height: 1067 },
  { id: "edm-02", group: "edm", src: "", alt: "A view of Muara Sikabaluan village", caption: "Muara Sikabaluan village", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/edm/edm-02.jpg", width: 1600, height: 1067 },
  { id: "edm-03", group: "edm", src: "", alt: "Volunteers at the community clean-up on 28 August", caption: "Community clean-up on 28 August", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/edm/edm-03.jpg", width: 1600, height: 1067 },
  { id: "edm-04", group: "edm", src: "", alt: "Galih training the village secretary on the website", caption: "Training the village secretary", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/edm/edm-04.jpg", width: 1600, height: 1067 },
  { id: "edm-05", group: "edm", src: "", alt: "Setting up the network equipment at SMAN 1 Siberut Utara", caption: "Network setup at SMAN 1 Siberut Utara", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/edm/edm-05.jpg", width: 1600, height: 1067 },
  { id: "edm-06", group: "edm", src: "", alt: "Students practising 10-finger typing", caption: "10-finger typing class", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/edm/edm-06.jpg", width: 1600, height: 1067 },

  { id: "muara-desktop", group: "muara", src: "", alt: "Home page of the Muara Sikabaluan website on a desktop", caption: "Home page", ratio: "16 / 10", spec: "1600 x 1000", path: "assets/images/projects/muara-sikabaluan/home-desktop.jpg", width: 1600, height: 1000, frame: "desktop" },
  { id: "muara-mobile", group: "muara", src: "", alt: "Home page of the Muara Sikabaluan website on a phone", caption: "Home page on a phone", ratio: "9 / 19.5", spec: "780 x 1690", path: "assets/images/projects/muara-sikabaluan/home-mobile.jpg", width: 780, height: 1690, frame: "phone" },
  { id: "muara-tourism", group: "muara", src: "", alt: "Tourism page of the Muara Sikabaluan website", caption: "Tourism page", ratio: "16 / 10", spec: "1600 x 1000", path: "assets/images/projects/muara-sikabaluan/tourism.jpg", width: 1600, height: 1000 },
  { id: "muara-umkm", group: "muara", src: "", alt: "UMKM directory of the Muara Sikabaluan website", caption: "UMKM directory", ratio: "16 / 10", spec: "1600 x 1000", path: "assets/images/projects/muara-sikabaluan/umkm.jpg", width: 1600, height: 1000 },
  { id: "muara-admin", group: "muara", src: "", alt: "Admin dashboard of the Muara Sikabaluan website", caption: "Admin dashboard", ratio: "16 / 10", spec: "1600 x 1000", path: "assets/images/projects/muara-sikabaluan/admin.jpg", width: 1600, height: 1000 },

  { id: "vcode-logo", src: "", alt: "V-Code logo", caption: "", ratio: "1 / 1", spec: "SVG or 512 x 512 PNG", path: "assets/images/brand/vcode-logo.svg", width: 512, height: 512, hidden: true },
  { id: "vcode-team", src: "assets/images/brand/vcode-team.jpg", alt: "Four people working on laptops at wooden tables on an outdoor terrace at night", caption: "V-Code", ratio: "16 / 9", spec: "1280 x 720", path: "assets/images/brand/vcode-team.jpg", width: 1280, height: 720 },
  { id: "codelamp-cert", src: "assets/images/certs/codelamp-mobile-pentest.jpg", alt: "Certificate of appreciation from Codelamp Indonesia to Galih Fajar Fahreza for taking part in Mini Bootcamp Mobile Penetration Testing #2", caption: "Mini Bootcamp Mobile Penetration Testing, Codelamp Indonesia", ratio: "1600 / 1131", spec: "1600 x 1131", path: "assets/images/certs/codelamp-mobile-pentest.jpg", width: 1600, height: 1131 },
  { id: "kpu-fti", src: "", alt: "A faculty election event by KPU FTI", caption: "Faculty election event", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/activities/kpu-fti-01.jpg", width: 1600, height: 1067, hidden: true },
  { id: "cyber-setup", src: "", alt: "A clean terminal screenshot with no target names", caption: "A clean desktop or terminal, no target names", ratio: "3 / 2", spec: "1600 x 1067", path: "assets/images/cyber/setup.jpg", width: 1600, height: 1067 },
  { id: "video-poster", src: "", alt: "Poster for the introduction video", caption: "", ratio: "16 / 9", spec: "1600 x 900", path: "assets/video/poster.jpg", width: 1600, height: 900 }
];
