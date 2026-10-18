/* ==========================================================================
   OURFLIX — all the content of the website lives in THIS file.
   Open it with Notepad / VS Code. Step-by-step help is in  edit.md
   Look for the ✏️ marks — those are the parts made for you to edit.
   (Keep the quotes "..." and the commas , exactly as they are.)
   ========================================================================== */
window.OURFLIX = {
  brand: "OURFLIX",
  monogram: "R♥A",
  her: "Riddhi",
  his: "Aditya",
  herNick: "Mohtarma",
  hisNick: "Adi",

  /* ✏️ Developer credit shown in the footer (bottom of the page) */
  developer: "Ayush",

  /* The moment the story began: 20 Dec 2025, 5:35 PM (evening), India time */
  start: "2025-12-20T17:35:00+05:30",
  startLabel: "20 December 2025 • 5:35 PM",
  timeZone: "Asia/Kolkata",

  /* The only time you met in real life */
  firstMet: "2024-07-26T00:00:00+05:30",
  firstMetLabel: "Kargil Vijay Diwas, 26 July 2024",

  /* ✏️ EDIT 1 — OPENING CURTAIN SOUND = song-1.mp3 (see ✏️ EDIT 3 below)
     "seconds" = how long the opening curtain animation lasts.
     If your intro sound is longer than 6.5 seconds, make this number bigger. */
  intro: { sound: "assets/audio/song-1.mp3", seconds: 6.5 },

  /* ==================================================================
     ✏️ EDIT 0 — THE MAIN PAGE TEXT (from Adi to Mohtarma)
     ================================================================== */
  page: {
    title: "Season 1 of Us",
    badge: "#1 IN ROMANCE TODAY • RIDDHI & ADITYA",
    synopsis: "We met in person just once — on Kargil Vijay Diwas, 2024. Then on 20 December 2025 at 5:35 PM, our story officially began. Every day since, Mohtarma, has been my favourite episode — and we're only just getting started.",
    welcome: "Welcome to Season 1 of Us, Mohtarma ❤️",
    reasonsTitle: "Why I Love You",
    watchingAs: "Watching as: Mohtarma"
  },
  /* The photo of you two together = main background of Season 1 */
  heroPhoto: { src: "assets/images/together.jpg", focus: "50% 38%" },

  /* ---------- "Who's watching?" ---------- */
  profiles: [
    { id: "her", name: "Mohtarma", role: "Riddhi • The Main Character ✨", src: "assets/images/riddhi-07.jpg", focus: "50% 25%" }
  ],

  /* ---------- The Yes / No game: 4 questions in a row ---------- */
  gate: {
    yes: ["Yes, Always ❤️", "Yes, Obviously 💕", "Yes, Forever 🥰", "YES, 100% 💖"],
    noLabel: "No 😢",
    rounds: [
      { q: "Wait! Quick security check: Do you love me?", sub: "Choose wisely... the 'No' button is allergic to being clicked 👀" },
      { q: "Hmm, are you sure? Do you love me even when I'm being annoying?", sub: "Think carefully. The 'No' button is getting nervous 😏" },
      { q: "Will you keep watching our story with me — every single season?", sub: "Season 2, 3, 4… the whole box set. Deal? 🍿" },
      { q: "Last one, I promise! Will you be my favourite person forever?", sub: "The 'No' button has officially left the building 🏃‍♂️💨" }
    ],
    dodges: [
      "Nice try! 😜", "Error 404: 'No' not found", "Too slow! 😎", "Button broken — click Yes ❤️",
      "Physics says NO to No!", "Catch me if you can!", "Plot twist: you love me!", "Just click Yes already 🥰"
    ],
    celebrate: ["That's my girl 💖", "Knew it 😏❤️", "Aww, stop it 🥹", "ACCESS GRANTED ✅"]
  },

  /* ==================================================================
     ✏️ EDIT 2 — EPISODES (your story + your letter)
     For every episode:
       title    = name of the episode
       note     = short preview (1–2 lines) shown on the card
       letter   = your LONG letter, shown when the episode is opened.
                  Write it between the two ` backticks — you can press Enter for new lines.
                  Leave it as `` (empty) to just show the note.
       secret   = the little surprise shown after tapping "Tap for a secret"
     "date" / "milestone" are calculated automatically — no need to touch them.
     ================================================================== */
  episodes: [
    {
      code: "S1:E0", title: "Prologue: The Day We Met", date: "2024-07-26", runtime: "The only time",
      location: "Kargil Vijay Diwas, 2024",
      src: "assets/images/aditya-04.jpg", focus: "50% 12%",
      note: "We have met in real life only once — on Kargil Vijay Diwas 2024. One day that I still replay in my head, Mohtarma.",
      letter: ``,
      secret: "One meeting was all it took. ❤️"
    },
    {
      code: "S1:E1", title: "The Pilot: Day One", milestone: { days: 0 }, runtime: "5:35 PM",
      location: "Where it all began",
      src: "assets/images/riddhi-05.jpg", focus: "50% 25%",
      note: "20 December 2025, 5:35 in the evening — the exact minute our story officially began. That was the start of my favourite season of life.",
      letter: ``,
      secret: "I would happily replay that evening on repeat. Every. Single. Time. ❤️"
    },
    {
      code: "S1:E2", title: "100 Days of Us", milestone: { days: 100 }, runtime: "100 days",
      location: "A hundred little reasons",
      src: "assets/images/aditya-08.jpg", focus: "50% 35%",
      note: "A hundred days of laughs, long chats and you turning ordinary days into special ones. It still feels like the first chapter.",
      letter: ``,
      secret: "100 days down — and I'd still choose you on day 1,000."
    },
    {
      code: "S1:E3", title: "Half a Year, Whole Heart", milestone: { months: 6 }, runtime: "6 months",
      location: "Six months strong",
      src: "assets/images/riddhi-10.jpg", focus: "50% 25%",
      note: "Six months in, and you're still my favourite notification, my calm and my chaos — all in one person.",
      letter: ``,
      secret: "My heart still does a tiny jump whenever your name pops up on my screen."
    },
    {
      code: "S1:E4", title: "Season Finale? Never.", milestone: { today: true }, runtime: "∞ mins",
      location: "Right here with you",
      src: "assets/images/together.jpg", focus: "50% 35%",
      note: "Thank you for being my person, Mohtarma. Here's to Season 2, Season 3, and a hundred more seasons of us.",
      letter: ``,
      secret: "Happy forever, my love. — Adi"
    }
  ],

  /* ---------- Polaroid wall (tap to flip) ---------- */
  polaroids: [
    { caption: "Main Character Energy ✨", src: "assets/images/riddhi-07.jpg", focus: "50% 22%", back: "Some people light up a room. You light up my entire day." },
    { caption: "His Side of the Story 🎬", src: "assets/images/aditya-02.jpg", focus: "50% 12%", back: "Me, pretending to be calm while thinking about you." },
    { caption: "Red Looks Good on You ❤️", src: "assets/images/riddhi-12.jpg", focus: "50% 30%", back: "Red is definitely your colour — I can't stop looking." },
    { caption: "Dressed Up & Smiling 🕴️", src: "assets/images/aditya-06.jpg", focus: "50% 10%", back: "Nervous, dressed up, and smiling — that's what you do to me." },
    { caption: "That Smile 😊", src: "assets/images/riddhi-05.jpg", focus: "50% 25%", back: "Your laugh is my favourite sound in the whole world." },
    { caption: "Road Trip Ready 🚗", src: "assets/images/aditya-08.jpg", focus: "50% 35%", back: "Anywhere is the right destination as long as you're next to me." }
  ],

  /* ---------- Photo galleries (every uploaded photo) ---------- */
  galleryHer: [
    { src: "assets/images/riddhi-01.jpg", focus: "50% 30%" },
    { src: "assets/images/riddhi-02.jpg", focus: "50% 40%" },
    { src: "assets/images/riddhi-03.jpg", focus: "50% 40%" },
    { src: "assets/images/riddhi-04.jpg", focus: "60% 30%" },
    { src: "assets/images/riddhi-05.jpg", focus: "50% 25%" },
    { src: "assets/images/riddhi-06.jpg", focus: "50% 45%" },
    { src: "assets/images/riddhi-07.jpg", focus: "50% 25%" },
    { src: "assets/images/riddhi-08.jpg", focus: "50% 40%" },
    { src: "assets/images/riddhi-09.jpg", focus: "50% 25%" },
    { src: "assets/images/riddhi-10.jpg", focus: "50% 25%" },
    { src: "assets/images/riddhi-11.jpg", focus: "50% 30%" },
    { src: "assets/images/riddhi-12.jpg", focus: "50% 30%" }
  ],
  galleryHim: [
    { src: "assets/images/aditya-01.jpg", focus: "50% 35%" },
    { src: "assets/images/aditya-02.jpg", focus: "50% 12%" },
    { src: "assets/images/aditya-03.jpg", focus: "50% 50%" },
    { src: "assets/images/aditya-04.jpg", focus: "50% 12%" },
    { src: "assets/images/aditya-05.jpg", focus: "50% 52%" },
    { src: "assets/images/aditya-06.jpg", focus: "50% 10%" },
    { src: "assets/images/aditya-07.jpg", focus: "50% 22%" },
    { src: "assets/images/aditya-08.jpg", focus: "50% 35%" },
    { src: "assets/images/aditya-09.jpg", focus: "50% 55%" },
    { src: "assets/images/aditya-10.jpg", focus: "50% 30%" },
    { src: "assets/images/aditya-11.jpg", focus: "50% 35%" }
  ],

  /* ==================================================================
     ✏️ EDIT 3 — YOUR 5 AUDIO FILES
     Copy the MP3 files into the folder  assets/audio/  and name them exactly:
       song-1.mp3  = the Netflix-style INTRO sound (plays when the curtain opens)
       song-2.mp3  song-3.mp3  song-4.mp3  song-5.mp3  = your 4 songs
     Then change the title and artist of songs 2–5 below.
     ================================================================== */
  songs: [
    { title: "Opening Curtain Sound", artist: "The intro • plays when the curtain opens", src: "assets/audio/song-1.mp3", intro: true },
    { title: "Our Song #1", artist: "Add artist name", src: "assets/audio/song-2.mp3" },
    { title: "Our Song #2", artist: "Add artist name", src: "assets/audio/song-3.mp3" },
    { title: "Our Song #3", artist: "Add artist name", src: "assets/audio/song-4.mp3" },
    { title: "Our Song #4", artist: "Add artist name", src: "assets/audio/song-5.mp3" }
  ],

  /* ✏️ EDIT 4 — "WHY I LOVE YOU" cards (tag = front of the card, text = the back).
     You can add or delete cards — each card is one { ... }, line. */
  reasons: [
    { tag: "Your Smile", text: "The way your whole face lights up over the smallest, happiest things." },
    { tag: "Safe Place", text: "One talk with you can fix even the heaviest day." },
    { tag: "Your Laugh", text: "It's honestly my favourite sound in the world." },
    { tag: "Your Kind Heart", text: "You care so deeply about the people you love." },
    { tag: "Your Voice", text: "Hearing from you is the best part of every single day." },
    { tag: "Your Style", text: "Red, pink, glasses or no glasses — you pull off everything." },
    { tag: "Late Night Talks", text: "Our conversations about life, dreams and absolutely random things." },
    { tag: "You Believe in Me", text: "Even on the days I forget to believe in myself." }
  ],

  /* ==================================================================
     ✏️ EDIT 6 — THE SECRET LETTER FROM ADI  (last section of the page)
     Write the letter between the two backticks `  ` below (the key left of 1).
     Press Enter for new lines. It is shown in HANDWRITING on a ruled paper.
     Leave it empty and the paper stays blank.
     ================================================================== */
  secret: {
    eyebrow: "One last thing",
    title: "A Secret Letter from Adi",
    hint: "Tap the envelope to open it 💌",
    to: "To: Mohtarma ❤️",
    from: "With love, Adi",
    letter: ``
  },

  /* ✏️ EDIT 5 — CAST & CREW cards (tap a card to show the "egg" secret line) */
  cast: [
    { role: "Lead Actress & Heart Thief", name: "Mohtarma", award: "🏆 Winner: Best Smile", egg: "Fun fact: wins every argument with just one cute look." },
    { role: "Lead Actor & Biggest Fan", name: "Adi", award: "🎥 Certified Fan Since 20 Dec 2025", egg: "Fun fact: smiles at his phone every time her name pops up." },
    { role: "Executive Producer", name: "Our Love ❤️", award: "🍿 Longest Running Series", egg: "Renewed for infinite seasons — no cancellation clause." },
    { role: "Soundtrack & Vibes", name: "Our Songs", award: "🎵 Platinum Certified Romance", egg: "Tap the vinyl player at the bottom of the screen to play our songs." }
  ]
};
