# Photos

Every image slot is defined in `data/photos.js`. A slot with `src: ""` shows a
designed placeholder; put the file in the path the placeholder shows, then set
`src` to that path (and `width`/`height` to the real pixel size).

Folders:

- `profile/`: portrait.jpg (4:5, 1200 x 1500), working.jpg (3:2, 1600 x 1067)
- `edm/`: edm-01.jpg to edm-06.jpg (3:2, 1600 x 1067)
- `projects/muara-sikabaluan/`: home-desktop.jpg (16:10), home-mobile.jpg (9:19.5), tourism.jpg, umkm.jpg, admin.jpg
- `brand/`: vcode-logo.svg (or a square PNG)
- `certs/`: codelamp-mobile-pentest.jpg (4:3, cover ID numbers and QR codes)
- `activities/`: kpu-fti-01.jpg (3:2)
- `cyber/`: setup.jpg (3:2, no target names)
- `og-image.png`: 1200 x 630 link preview (a generated placeholder for now)
- `../video/poster.jpg`: 16:9, 1600 x 900

Naming: lowercase, words joined with hyphens, no spaces (GitHub Pages is case-sensitive).
Format: JPEG or WebP, longest edge 1600 px, 150 to 400 KB.
Always strip EXIF data (phone photos carry GPS coordinates): `tools/optimize-images.sh <folder>`.
Ask before showing identifiable people, especially students and children.
Never show ID numbers, certificate numbers, QR codes, private chats, or credentials.
