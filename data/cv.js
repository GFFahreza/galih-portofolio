/*
  Galih's CV, shown in the CV section. Source: _inbox/CONTENT_CV_Informatics_v2.md.
  The page shows the finished CV, laid out in the order of the lecturer's
  guide (Steps 3 to 10), with a master version and four tailored versions.

  Edit text here; js/cv.js only builds the layout.

  Rules
  - Never put the phone number or email here ("Available on request").
  - Leave [CONFIRM] items out until Galih approves them.
    Still waiting: the Desa Cisempur village website, the GitHub link, the thesis
    dataset detail, the Smart Comp year, MikroTik as a skill, and the two
    school-representative roles as certifications.
  - Experience entries are listed once in `experience`; each version picks
    and orders them by id. An entry with `pending: true` shows "Details coming soon".
  - `photo` (optional) on an entry, and `photos` (optional) on a version, name
    photo slots from data/photos.js. `gallery` (optional) on an entry names a
    photo group (e.g. "edm"). Fill the `src` there, not here.
*/
window.CV = {
  intro: [
    "This is my CV, built part by part in the order our CV guide recommends. The first tab shows my master CV. The other four show how the same facts can be tailored for four different roles."
  ],

  name: "Galih Fajar Fahreza",
  headline: "Informatics undergraduate",
  city: "Cilacap, Central Java",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/galih-fajar-fahreza-6b907a310/" },
    { label: "Live project", href: "https://desa-muara-sikabaluan.vercel.app" }
  ],
  contactNote: "Phone and email: available on request.",

  // Step labels shown next to each part of the CV.
  steps: {
    contact: { n: 3, label: "Personal information" },
    profile: { n: 4, label: "Professional profile" },
    education: { n: 5, label: "Education" },
    experience: { n: 6, label: "Experience" },
    skills: { n: 7, label: "Skills" },
    portfolio: { n: "8, 9", label: "Projects and portfolio" },
    certifications: { n: 8, label: "Certifications and achievements" },
    references: { n: 10, label: "References" }
  },

  education: [
    {
      title: "S1 Informatics",
      org: "Universitas Ahmad Dahlan",
      place: "Yogyakarta",
      period: "2023 to expected 2027",
      groups: [
        { label: "Relevant coursework", items: ["Information Security (social engineering, operating system security, VPN, firewalls, penetration testing)", "Software Engineering", "Mobile Programming (Android and Kotlin)", "Deep Learning", "Computer Vision", "Data Mining", "Image Processing", "Automata Theory"] }
      ],
      bullets: [
        "Undergraduate thesis (in progress, proposal stage): \"Design and Development of a Real-Time Phishing URL Detection System Based on Random Forest and XGBoost with SHAP Feature Selection\".",
        "Academic project: contributed a feature to a shared Laravel ERP repository for a Software Engineering course, working on a separate branch.",
        "Academic project: carried out a security assessment of web applications during an internship (KP) and documented the findings for the supervisor.",
        "Academic project: reviewed five papers on web application vulnerabilities (OWASP Top 10) and adversarial attacks on intrusion detection for a group journal assignment (the reading list on this site).",
        "Academic project: completed a Deep Learning practicum covering LSTM, GRU, Transformer, DCGAN, and neural machine translation."
      ]
    },
    {
      title: "Vocational high school (SMK), Computer and Network Engineering (TKJ)",
      org: "SMK Tamtama 1 Sidareja",
      period: "2018 to 2021",
      bullets: [
        "Studied computer and network engineering: learned to design, build, and set up computer networks.",
        "Completed a work placement (PKL) at the computer shop Smart Comp as a computer technician.",
        "Selected as the school's representative in the district-level system administrator (sysadmin) competition and in the MikroTik network olympiad."
      ]
    }
  ],

  experience: {
    muara: {
      title: "Independent project: Muara Sikabaluan village website",
      org: "Mentawai Islands",
      period: "2026",
      bullets: [
        "Designed and built a website that promotes the tourism, local businesses (UMKM), and culture of Muara Sikabaluan village.",
        "Built it with Next.js, React, TypeScript, Tailwind CSS, and Supabase (database, authentication, storage), and deployed it on Vercel with automatic deploys from GitHub.",
        "Trained the village secretary to manage the website's content."
      ],
      link: { label: "desa-muara-sikabaluan.vercel.app", href: "https://desa-muara-sikabaluan.vercel.app" },
      gallery: "muara"
    },
    edm: {
      title: "Volunteer, Ekspedisi Dahlan Muda (EDM)",
      org: "Muara Sikabaluan, Mentawai Islands",
      period: "Semester break 2026",
      bullets: [
        "Joined a one-month community service expedition run by the university.",
        "Helped set up internet equipment (Starlink, a wireless repeater router, and an access point) for teachers at SMAN 1 Siberut Utara and taught 10-finger typing to 11th graders.",
        "Served as person in charge of waste management and organised a community clean-up on 28 August 2026."
      ],
      gallery: "edm"
    },
    vcode: {
      title: "Founder, V-Code (software house)",
      org: "Entrepreneurship",
      bullets: ["Founded and manages V-Code, a software house focused on software development."],
      photo: "vcode-team",
      photoWide: true
    },
    kpu: {
      title: "Public Relations Staff, Faculty of Industrial Technology Election Commission (KPU FTI)",
      period: "2024 to 2025",
      bullets: [
        "Handled communication and publication of information about the faculty election.",
        "Coordinated with various parties to keep the election running smoothly."
      ]
    },
    smartcomp: {
      title: "Computer Technician (PKL work placement), Smart Comp computer shop",
      bullets: [
        "Worked as a computer technician: repaired and maintained computer and laptop hardware, including diagnosing faulty components.",
        "Handled customer complaints about hardware and software problems and proposed repair solutions."
      ]
    },
    thesis: {
      title: "Undergraduate thesis: Design and Development of a Real-Time Phishing URL Detection System Based on Random Forest and XGBoost with SHAP Feature Selection",
      org: "Universitas Ahmad Dahlan, Software Engineering and Data track",
      period: "In progress (proposal stage)",
      bullets: ["Designing a real-time system that detects phishing URLs with Random Forest and XGBoost, using SHAP for feature selection."]
    },
    infosec: {
      title: "Information Security coursework",
      org: "Universitas Ahmad Dahlan",
      bullets: ["Covered social engineering, operating system security, VPN, firewalls, and penetration testing."]
    },
    bounty: {
      title: "Bug hunter",
      tag: "Cybersecurity",
      placeholder: true, // DUMMY: replace with real facts (the whole entry)
      summary: "Tested web applications and software for security weaknesses and reported my findings to the owners through responsible disclosure.", // DUMMY: replace with real facts
      scope: "Several websites and software products (names withheld under disclosure rules).", // DUMMY: replace with real facts
      bullets: [
        "Looked for common weaknesses such as broken access control, cross-site scripting, security misconfiguration, and exposed information.", // DUMMY: replace with real facts
        "Used Burp Suite and nmap for testing, and kept notes so each finding could be reproduced.", // DUMMY: replace with real facts
        "Wrote clear reports with the steps, the impact, and a suggested fix, and sent them privately to the owners." // DUMMY: replace with real facts
      ],
      story: "In one test, I found an access control weakness that let a regular user see data meant for another account. I documented the steps, reported it privately, and the owner fixed it afterwards.", // DUMMY: replace with real facts
      chips: ["Web security testing", "Reconnaissance", "Vulnerability reporting", "Burp Suite", "nmap"] // DUMMY: replace with real facts
    }
  },

  languages: [
    "Indonesian: native",
    "English: ADEPT (Ahmad Dahlan English Proficiency Test), score 520"
  ],

  certifications: [
    "Mini Bootcamp Mobile Penetration Testing, Codelamp Indonesia",
    "ADEPT (Ahmad Dahlan English Proficiency Test), score 520"
  ],

  references: "Available on request.",

  versions: {
    master: {
      label: "Master CV",
      profile: "Informatics undergraduate at Universitas Ahmad Dahlan with a Computer and Network Engineering background. Full-stack developer and bug hunter, writing an undergraduate thesis on real-time phishing URL detection. Builds web applications end to end, from interface and database to testing and deployment, and founded V-Code, a software house. Took part in a community service expedition in the Mentawai Islands, where he built a tourism and local-business website for Muara Sikabaluan village. Strong interest in web development and cybersecurity, and used to working in teams.",
      experience: ["muara", "edm", "vcode", "kpu", "smartcomp", "bounty"],
      skills: ["Web design", "Front-end coding", "Back-end coding", "JavaScript", "TypeScript", "React", "Next.js", "PHP", "Laravel", "Tailwind CSS", "C++", "Supabase and PostgreSQL", "Deployment (Vercel)", "Git and GitHub", "QA testing", "Networking basics", "Security tools: Burp Suite, nmap, bettercap, Frida"],
      portfolio: [
        { label: "Live project: Muara Sikabaluan village website", href: "https://desa-muara-sikabaluan.vercel.app" },
        { label: "The journal reading list on this site", href: "#journals" }
      ]
    },
    fullstack: {
      label: "Full-stack developer",
      profile: "Informatics undergraduate who builds and ships web applications. Built a tourism and local-business website for Muara Sikabaluan village with Next.js, TypeScript, and Supabase. Founder of V-Code, a software house. Seeking a junior full-stack role.",
      experience: ["muara", "vcode", "edm", "kpu", "smartcomp:short"],
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "PHP", "Laravel", "Tailwind CSS", "Supabase and PostgreSQL", "Vercel deployment", "Git and GitHub"],
      portfolio: [
        { label: "Live project: Muara Sikabaluan village website", href: "https://desa-muara-sikabaluan.vercel.app" }
      ]
    },
    cyber: {
      label: "Cybersecurity analyst",
      profile: "Informatics undergraduate with a Computer and Network Engineering background and training in mobile penetration testing (Codelamp Indonesia mini bootcamp). Practices bug bounty and CTF, and is familiar with Burp Suite, nmap, bettercap, and Frida. Seeking an entry-level security role.",
      experience: ["thesis", "bounty:short", "infosec", "muara", "smartcomp"],
      skills: ["Networking (from TKJ)", "Linux", "Web security basics", "Security tools: Burp Suite, nmap, bettercap, Frida", "PHP and JavaScript code reading", "Hardware diagnosis"],
      portfolio: [
        { label: "The journal reading list on this site (cybersecurity papers)", href: "#journals" }
      ],
      photos: ["cyber-setup"]
    },
    qa: {
      label: "Software tester (QA)",
      profile: "Informatics undergraduate who builds web applications himself, so he reads code and understands how defects arise. Tested the Muara Sikabaluan village website before its release. Seeking a junior QA role in a team that values quality.",
      experience: ["muara:qa", "bounty:short", "vcode", "kpu"],
      skills: ["QA testing", "Bug reporting", "Web technologies (React, Laravel, Next.js)", "Git and GitHub"],
      portfolio: [
        { label: "Live project: Muara Sikabaluan village website", href: "https://desa-muara-sikabaluan.vercel.app" }
      ]
    },
    support: {
      label: "IT support and network technician",
      profile: "Informatics undergraduate with a Computer and Network Engineering background: trained to design, build, and set up networks, a computer technician during a work placement at Smart Comp, and the school's representative in a district sysadmin competition and the MikroTik network olympiad. Helped set up internet equipment for teachers in the Mentawai Islands during a community service expedition. Skilled at diagnosing faults and explaining fixes to non-technical users. Seeking an entry-level support role.",
      experience: ["smartcomp", "edm", "vcode"],
      skills: ["Hardware diagnosis", "Network setup (Starlink, repeater, access point)", "Operating systems", "Customer communication", "Deployment basics"],
      portfolio: [
        { label: "Live project: Muara Sikabaluan village website", href: "https://desa-muara-sikabaluan.vercel.app" }
      ]
    }
  },

  // Entry variants used by the versions above ("id:variant").
  variants: {
    "bounty:short": { scope: "", bullets: [], story: "", placeholder: true }, // DUMMY: replace with real facts
    "smartcomp:short": { bullets: ["Worked as a computer technician: repaired and maintained computer and laptop hardware, including diagnosing faulty components."] },
    "muara:qa": { bullets: [
      "Designed and built a website that promotes the tourism, local businesses (UMKM), and culture of Muara Sikabaluan village.",
      "Tested the website before its release.",
      "Built it with Next.js, React, TypeScript, Tailwind CSS, and Supabase, and deployed it on Vercel."
    ] }
  },

  // The guide's final review (Step 13), stated as what was done.
  checklist: [
    { text: "Matches the position", proof: "Four tailored versions above." },
    { text: "Contact information accurate", proof: "City and LinkedIn shown; phone and email available on request." },
    { text: "Education and graduation date correct", proof: "S1 Informatics, 2023 to expected 2027." },
    { text: "Experience truthful", proof: "Every entry comes from my own records." },
    { text: "Grammar and spelling checked", proof: "" },
    { text: "Skills supported by examples", proof: "Each skill appears next to a project or role." },
    { text: "Portfolio links work", proof: "The live site is linked." },
    { text: "Consistent format, saved as PDF", proof: "Galih_Fajar_Fahreza_CV.pdf." }
  ],

  spec: "One page per version, Calibri 11 pt, single column, standard headings, PDF."
};
