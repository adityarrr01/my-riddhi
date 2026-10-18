# ✏️ edit.md — how to change things yourself (no coding needed)

**What you need:** any text editor — Notepad (Windows), TextEdit in plain-text mode (Mac) or VS Code.
**After every change:** save the file, then press **refresh** in the browser tab where `index.html` is open.

Almost everything is in one file: **`data.js`**. Search (Ctrl+F) for `✏️ EDIT` and you will find every section meant for you.

### Golden rules
- Keep the quotes `"..."` and the commas `,` exactly where they are.
- Don't use a plain double quote `"` *inside* your sentence (use ' or “ ” instead).
- A mistake somewhere? Undo (Ctrl+Z) and compare with the examples below.

---

## 0. 📝 Main page text (`✏️ EDIT 0`)
The page is made **from Adi to Mohtarma**. The headline, badge and intro paragraph are in `data.js` under `page:`.
Both of your photos are on this page: the episodes, the polaroids and the two photo rows ("Starring Riddhi" and "Starring Aditya").

---

## 1. 🎬🎵 Your 5 audio files (`✏️ EDIT 1` and `✏️ EDIT 3`)
Copy all 5 MP3 files into the folder **`assets/audio/`** and name them exactly:

| File | What it is | Where it plays |
|---|---|---|
| `song-1.mp3` | the **Netflix-style intro sound** | when the red curtain opens |
| `song-2.mp3` | your song 1 | music player (starts right after the opening) |
| `song-3.mp3` | your song 2 | music player |
| `song-4.mp3` | your song 3 | music player |
| `song-5.mp3` | your song 4 | music player |

- In `data.js`, find the `songs:` block and change only the `title` and `artist` of songs 2–5, for example:
  ```js
  { title: "Tum Hi Ho", artist: "Arijit Singh", src: "assets/audio/song-2.mp3" },
  ```
- The intro (song 1) is only used for the curtain opening. It is not shown in "Our Songs" and the player skips it — only your 4 songs appear.
- `intro: { sound: "assets/audio/song-1.mp3", seconds: 6.5 }` — `seconds` is how long the curtain animation runs. If your intro sound is longer, put a bigger number (e.g. `9`).
- Don't have `song-1.mp3` yet? The site plays a built-in "tudum" sound so the opening is never silent.

> The opening starts after one tap on **"Tap to open the curtain"** — phones and browsers don't allow sound without a tap.

## 2. (songs are now part of section 1 above)

---

## 3. 💌 Episode stories + your letter (`✏️ EDIT 2`)
Each episode looks like this:
```js
{
  code: "S1:E1", title: "The Pilot: Day One", milestone: { days: 0 }, runtime: "5:35 PM",
  location: "Where it all began",
  src: "assets/images/riddhi-05.jpg", focus: "50% 25%",
  note: "Short 1–2 line preview shown on the card.",
  letter: ``,
  secret: "Little surprise shown when she taps 'Tap for a secret'."
},
```
- **`note`** → short preview on the card.
- **`letter`** → your full letter, shown (in handwriting style) when the episode is opened.
  Write it between the two backticks `` ` ` `` (the key left of **1**). You can press Enter for new lines:
  ```js
  letter: `Mohtarma,

  The first time I saw you was Kargil Vijay Diwas, 2024...
  (write as much as you want)

  Yours,
  Adi`,
  ```
  Leave it as `` ` ` `` (empty) and the short `note` is shown instead.
- **`title`**, **`location`**, **`secret`** → change freely.
- Dates are automatic: E0 = 26 July 2024, E1 = day one, E2 = 100 days, E3 = 6 months, E4 = "Today & Always".
- Want a different photo? See section 6.

## 4. 💖 "Why I love you" cards (`✏️ EDIT 4`)
One card per line:
```js
{ tag: "Your Smile", text: "The way your whole face lights up..." },
```
`tag` = front of the card, `text` = what she reads after tapping. Add, delete or rewrite any line.

## 5. 🎭 Cast & Crew (`✏️ EDIT 5`)
```js
{ role: "Lead Actress & Heart Thief", name: "Mohtarma", award: "🏆 Winner: Best Smile", egg: "Fun fact: ..." },
```
`egg` is the secret line that appears when the card is tapped.

## 6. 🖼️ Change or add photos
1. Copy the new photo into **`assets/images/`** (JPG, ideally under 500 KB).
2. In `data.js`, set `src: "assets/images/your-photo.jpg"` on the episode / polaroid / gallery line.
3. `focus: "50% 25%"` decides which part stays visible when the photo is cropped:
   first number = left↔right, second = top↔bottom. Face too high/low? Make the second number smaller (more top) or bigger (more bottom).
4. The **main Season 1 background** is `heroPhoto` near the top of `data.js` (currently `together.jpg`).

## 7. 📝 Names, nicknames & dates (top of `data.js`)
- `developer: "Ayush"` → the "Developed by … © All rights reserved" line in the footer.
- `herNick: "Mohtarma"`, `hisNick: "Adi"` → nicknames used around the site.
- `start` → when your relationship began: `"2025-12-20T17:35:00+05:30"` (20 Dec 2025, 5:35 PM, India time). The live timer, months and anniversary countdown all follow this.
- `firstMet` / `firstMetLabel` → the Kargil Vijay Diwas meeting.
- The Yes/No questions are in the `gate:` block.

## 8. 💌 The secret letter from Adi (`✏️ EDIT 6`) — last section of the page
It is a closed envelope; when Riddhi taps it, it opens into a ruled paper written in **handwriting**.
It is **blank right now**. To write it, open **`data.js`**, search for `✏️ EDIT 6` and write between the two backticks:
```js
secret: {
  ...
  letter: `My Mohtarma,

  (write your love letter here — press Enter for new lines)

  Yours forever`
},
```
- `letter` → the whole letter text. Empty = blank paper.
- `to` → the words on the envelope, `from` → the signature under the letter (shown only once the letter has text).
- `title`, `eyebrow`, `hint` → the small texts around the envelope.

## 9. 🚀 Send it to Riddhi
Drag the **whole folder** onto **https://app.netlify.com/drop** — you get a link you can send her.
(Opening `index.html` on your own computer works too.)
