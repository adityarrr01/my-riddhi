/* ==========================================================================
   OURFLIX — interactivity
   Reads everything from data.js (window.OURFLIX).
   ========================================================================== */
(function () {
  'use strict';
  const D = window.OURFLIX;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const START = new Date(D.start);
  const DAY = 864e5;

  const state = { profile: null, gatePassed: false, round: 0, epIndex: 0, song: 0, lbList: [], lbIndex: 0 };

  /* ---------------------------------------------------------------- helpers */
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: D.timeZone });
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
  const imgTag = (o, alt = '') => `<img src="${o.src}" alt="${alt}" style="object-position:${o.focus || '50% 50%'}">`;

  function setImg(el, o) { el.src = o.src; el.style.objectPosition = o.focus || '50% 50%'; }

  function toast(msg, ms = 2600) {
    const t = $('#toast');
    t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.add('hidden'), ms);
  }

  function burst(x, y, emojis = ['❤️', '💖', '💕', '✨', '💘'], n = 14) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = (x + (Math.random() - .5) * 140) + 'px';
      p.style.top = (y + (Math.random() - .5) * 40) + 'px';
      p.style.fontSize = (16 + Math.random() * 20) + 'px';
      p.style.animationDelay = (Math.random() * .25) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2600);
    }
  }

  function showScreen(name) {
    ['splash', 'profiles', 'gate', 'dashboard'].forEach((s) => {
      const el = $('#screen-' + s);
      if (el) el.classList.toggle('hidden', s !== name);
    });
    document.body.classList.toggle('no-scroll', name !== 'dashboard');
    $('#player').classList.toggle('hidden', name !== 'dashboard');
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------------- sound: "tudum" */
  function tudum() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx(); const now = ctx.currentTime;
      [[0, 98], [0.34, 73.4]].forEach(([t, f]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + t);
        o.frequency.exponentialRampToValueAtTime(f * 0.7, now + t + 1.3);
        g.gain.setValueAtTime(0.0001, now + t);
        g.gain.exponentialRampToValueAtTime(0.55, now + t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + 1.7);
        o.connect(g).connect(ctx.destination);
        o.start(now + t); o.stop(now + t + 1.8);
      });
      setTimeout(() => ctx.close && ctx.close(), 2600);
    } catch (e) { /* sound is optional */ }
  }

  /* ---------------------------------------------------------------- opening curtain intro */
  function initSplash() {
    $('#splash-monogram').textContent = D.monogram;
    $('#splash-brand').textContent = D.brand;
    $('#splash-names').textContent = D.her + ' & ' + D.his;
    $('#cta-names').textContent = D.her + ' & ' + D.his + ' — a love story';
    const colors = ['#E50914', '#ff3b30', '#ff9500', '#E50914', '#af52de', '#007aff', '#E50914', '#ff2d55'];
    $('#spectrum').innerHTML = colors.map((c, i) => `<i style="background:${c};animation-delay:${(i * 0.02).toFixed(2)}s"></i>`).join('');

    const intro = new Audio(D.intro.sound);
    intro.preload = 'auto';

    $('#splash-btn').addEventListener('click', () => {
      const splash = $('#screen-splash');
      const total = Math.max(4.5, +D.intro.seconds || 6.5) * 1000;

      // 1) the sound: your intro file (assets/audio/song-1.mp3) — or a built-in "tudum" if it isn't added yet
      let fell = false;
      const fallback = () => { if (!fell) { fell = true; tudum(); } };
      intro.addEventListener('error', fallback, { once: true });
      const p = intro.play(); if (p && p.catch) p.catch(fallback);

      // unlock the song player now (phones only allow sound after a tap)
      try { audio.muted = true; const u = audio.play(); if (u && u.then) u.then(() => { audio.pause(); audio.muted = false; }).catch(() => { audio.muted = false; }); else { audio.pause(); audio.muted = false; } } catch (e) { audio.muted = false; }

      // 2) curtains open -> logo reveal -> zoom into the logo -> profiles
      splash.classList.add('opening');
      setTimeout(() => { splash.classList.add('reveal'); $('#spectrum').classList.add('active'); }, 1500);
      setTimeout(() => { splash.classList.add('zooming'); }, total - 1900);
      setTimeout(() => {
        fadeOut(intro);
        showScreen('profiles');
        playSong(firstSong(), true);  // our first real song starts after the intro
      }, total);
    }, { once: true });
  }

  function fadeOut(a) {
    try {
      let v = a.volume;
      const t = setInterval(() => { v = Math.max(0, v - 0.1); a.volume = v; if (v <= 0) { clearInterval(t); a.pause(); } }, 70);
    } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------------- profiles */
  function initProfiles() {
    $('#profiles-brand').textContent = D.brand;
    $('#profiles-grid').innerHTML = D.profiles.map((p, i) => `
      <button class="profile-card" data-i="${i}">
        <div class="profile-pic">${imgTag(p, p.name)}</div>
        <span class="profile-name">${p.name}</span>
        <span class="profile-role">${p.role}</span>
      </button>`).join('');
    $$('.profile-card').forEach((b) => b.addEventListener('click', () => chooseProfile(D.profiles[+b.dataset.i])));
  }

  function chooseProfile(p) {
    state.profile = p;
    setImg($('#nav-avatar'), p);
    $('#nav-name').textContent = p.name;
    applyView();
    if (state.gatePassed) { showScreen('dashboard'); return; }
    startGate(p);
  }

  /* ---------------------------------------------------------------- the Yes / No game (4 rounds) */
  const G = { dodges: 0, lastX: -999, lastY: -999, lastT: 0, busy: false };
  const yesBtn = () => $('#gate-yes');
  const noBtn = () => $('#gate-no');

  function startGate(p) {
    state.round = 0;
    setImg($('#gate-avatar'), p);
    $('#gate-bg').style.backgroundImage = `url("${D.heroPhoto.src}")`;
    $('#gate-dots').innerHTML = D.gate.rounds.map(() => '<i></i>').join('');
    showScreen('gate');
    renderRound();
  }

  function renderRound() {
    const r = D.gate.rounds[state.round];
    G.dodges = 0; G.busy = false; G.lastX = G.lastY = -999;
    $('.gate-actions').classList.remove('moved');
    $('#gate-question').textContent = r.q;
    $('#gate-sub').textContent = r.sub;
    $('#gate-yes-label').textContent = D.gate.yes[state.round % D.gate.yes.length];
    $('#gate-badge').textContent = `Security Check • ${state.round + 1}/${D.gate.rounds.length}`;
    $('#gate-toast').textContent = '';
    $('#gate-pill').classList.remove('show');
    $$('#gate-dots i').forEach((d, i) => { d.className = i < state.round ? 'done' : (i === state.round ? 'now' : ''); });
    const y = yesBtn(), n = noBtn();
    y.style.transform = 'scale(1)';
    n.textContent = D.gate.noLabel;
    n.style.transform = 'scale(1)';
    n.style.transition = 'none';
    requestAnimationFrame(() => { placeNoAtSlot(); requestAnimationFrame(() => { n.style.transition = ''; }); });
  }

  function placeNoAtSlot() {
    const slot = $('#gate-no-slot').getBoundingClientRect();
    const n = noBtn();
    n.style.left = Math.round(slot.left + (slot.width - n.offsetWidth) / 2) + 'px';
    n.style.top = Math.round(slot.top + (slot.height - n.offsetHeight) / 2) + 'px';
  }

  function dodgeNo(ev) {
    if (ev && ev.cancelable) ev.preventDefault();
    const now = Date.now();
    if (now - G.lastT < 180) return;           // avoid double counting hover + touch
    G.lastT = now; G.dodges++;
    $('.gate-actions').classList.add('moved');
    const n = noBtn(), y = yesBtn();
    const w = n.offsetWidth, h = n.offsetHeight, m = 10;
    const yr = y.getBoundingClientRect();
    const qr = $('#gate-question').getBoundingClientRect(), sr = $('#gate-sub').getBoundingClientRect();
    const maxX = Math.max(m, innerWidth - w - m), maxY = Math.max(m, innerHeight - h - m);
    let x = m, yy = m, tries = 0, ok = false;
    while (!ok && tries++ < 60) {
      x = m + Math.random() * (maxX - m);
      yy = m + Math.random() * (maxY - m);
      const hit = (r, pad) => x < r.right + pad && x + w > r.left - pad && yy < r.bottom + pad && yy + h > r.top - pad;
      const farEnough = Math.hypot(x - G.lastX, yy - G.lastY) > Math.min(innerWidth, innerHeight) * 0.22;
      // keep clear of the Yes button and of the question text so it always stays readable
      ok = !hit(yr, 18) && !hit(qr, 6) && !hit(sr, 6) && (farEnough || tries > 40);
    }
    G.lastX = x; G.lastY = yy;
    n.style.left = Math.round(x) + 'px';
    n.style.top = Math.round(yy) + 'px';

    // The longer it runs, the bigger Yes gets (and from question 3, the smaller No gets)
    y.style.transform = `scale(${(1 + Math.min(G.dodges * 0.05, 0.5)).toFixed(2)})`;
    if (state.round >= 2) n.style.transform = `scale(${Math.max(0.55, 1 - G.dodges * 0.06).toFixed(2)})`;

    const msg = D.gate.dodges[(G.dodges - 1) % D.gate.dodges.length];
    n.textContent = msg;
    const pill = $('#gate-pill');
    pill.textContent = `Dodge #${G.dodges}: "${msg}"`;
    pill.classList.add('show');
  }

  function answerYes(ev) {
    if (G.busy) return;
    G.busy = true;
    const r = ev.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, undefined, 16);
    $('#gate-toast').textContent = D.gate.celebrate[state.round % D.gate.celebrate.length];
    $$('#gate-dots i')[state.round].className = 'done';
    const last = state.round >= D.gate.rounds.length - 1;
    setTimeout(() => {
      if (last) { state.gatePassed = true; enterDashboard(); }
      else { state.round++; renderRound(); }
    }, last ? 1100 : 900);
  }

  function initGate() {
    const n = noBtn();
    n.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') dodgeNo(e); });
    n.addEventListener('pointerdown', dodgeNo);
    n.addEventListener('touchstart', dodgeNo, { passive: false });
    n.addEventListener('click', dodgeNo);
    n.addEventListener('focus', dodgeNo);
    yesBtn().addEventListener('click', answerYes);
    window.addEventListener('resize', () => { if (!$('#screen-gate').classList.contains('hidden') && G.dodges === 0) placeNoAtSlot(); });
  }

  function enterDashboard() {
    tudum();
    showScreen('dashboard');
    updateTimer();
    setTimeout(() => { $('#watch-bar').style.width = state.pct + '%'; }, 300);
    burst(innerWidth / 2, innerHeight * 0.7, undefined, 22);
    toast(D.page.welcome, 3200);
  }

  /* ---------------------------------------------------------------- live timer (from 20 Dec 2025, 5:35 PM) */
  function monthsAndDays(now) {
    let m = (now.getFullYear() - START.getFullYear()) * 12 + (now.getMonth() - START.getMonth());
    if (addMonths(START, m) > now) m--;
    m = Math.max(0, m);
    const anchor = addMonths(START, m);
    const d = Math.floor((now - anchor) / DAY);
    return { m, d, nextDate: addMonths(START, m + 1) };
  }

  function updateTimer() {
    const now = new Date();
    const diff = Math.max(0, now - START);
    const days = Math.floor(diff / DAY);
    const hours = Math.floor((diff % DAY) / 36e5);
    const mins = Math.floor((diff % 36e5) / 6e4);
    const secs = Math.floor((diff % 6e4) / 1e3);
    $('#t-days').textContent = days;
    $('#t-hours').textContent = pad(hours);
    $('#t-mins').textContent = pad(mins);
    $('#t-secs').textContent = pad(secs);

    const md = monthsAndDays(now);
    const mWord = md.m === 1 ? 'month' : 'months', dWord = md.d === 1 ? 'day' : 'days';
    $('#t-months').textContent = `= ${md.m} ${mWord} & ${md.d} ${dWord} together`;
    $('#t-beats').textContent = Math.floor((diff / 1000) * 2.4).toLocaleString('en-IN');

    const untilNext = md.nextDate - now;
    const nd = Math.floor(untilNext / DAY), nh = Math.floor((untilNext % DAY) / 36e5);
    const label = (md.m + 1) % 12 === 0 ? `${(md.m + 1) / 12}-year anniversary` : `${md.m + 1}-month anniversary`;
    $('#t-next').textContent = `Next: our ${label} on ${fmtDate(md.nextDate)} — in ${nd}d ${nh}h`;

    const metDays = Math.floor((now - new Date(D.firstMet)) / DAY);
    $('#t-met').textContent = `${D.firstMetLabel} (${metDays} days ago)`;

    const year = 365 * DAY;
    state.pct = Math.min(100, (diff / year) * 100);
    $('#watch-pct').textContent = state.pct.toFixed(1) + '% of Season 1';
    $('#watch-next').textContent = 'Next episode: our 1st anniversary, ' + fmtDate(addMonths(START, 12));

    state.nextLabel = `${label} on ${fmtDate(md.nextDate)}`;
    state.nextIn = `${nd} day${nd === 1 ? '' : 's'}`;
    state.days = days;
  }

  /* ---------------------------------------------------------------- episodes */
  function epDate(ep) {
    const m = ep.milestone || {};
    if (ep.date) return fmtDate(new Date(ep.date + 'T12:00:00+05:30'));
    if (m.today) return 'Today & Always';
    if (m.months != null) return fmtDate(addMonths(START, m.months));
    return fmtDate(addDays(START, m.days));
  }

  function renderEpisodes() {
    $('#episodes-grid').innerHTML = D.episodes.map((ep, i) => `
      <button class="ep-card" data-i="${i}">
        <div class="ep-thumb">
          ${imgTag(ep, ep.title)}
          <span class="ep-code">${ep.code}</span>
          <div class="ep-play"><span>▶</span></div>
          <div class="ep-progress"><i style="width:${[85, 89, 93, 97][i] || 90}%"></i></div>
        </div>
        <div class="ep-body">
          <div>
            <div class="ep-meta"><span>${epDate(ep)}</span><span class="mono">${ep.runtime}</span></div>
            <h3 class="ep-title">${ep.title}</h3>
            <p class="ep-note">${ep.note}</p>
          </div>
          <div class="ep-foot"><span>📍 ${ep.location}</span><b>Open ›</b></div>
        </div>
      </button>`).join('');
    $$('.ep-card').forEach((c) => c.addEventListener('click', () => openEpisode(+c.dataset.i)));
  }

  function openEpisode(i) {
    const n = D.episodes.length;
    state.epIndex = (i + n) % n;
    const ep = D.episodes[state.epIndex];
    setImg($('#ep-img'), ep);
    $('#ep-code').textContent = ep.code;
    $('#ep-date').textContent = epDate(ep);
    $('#ep-run').textContent = ep.runtime;
    $('#ep-title').textContent = ep.title;
    $('#ep-loc').textContent = '📍 ' + ep.location;
    $('#ep-note').textContent = (ep.letter && ep.letter.trim()) ? ep.letter.trim() : ep.note;
    $('#ep-secret').textContent = ep.secret;
    $('#ep-secret').classList.add('hidden');
    $('#ep-secret-btn').classList.remove('hidden');
    $('#modal-episode').classList.remove('hidden');
  }

  /* ---------------------------------------------------------------- polaroids / gallery / songs / reasons / cast */
  function renderPolaroids() {
    $('#polaroid-grid').innerHTML = D.polaroids.map((p) => `
      <div class="pol">
        <div class="pol-inner">
          <div class="pol-face">
            <div class="pol-photo">${imgTag(p, p.caption)}</div>
            <div class="pol-cap"><b>${p.caption}</b><small>tap to flip</small></div>
          </div>
          <div class="pol-face pol-back">
            <p>${p.back}</p>
            <small>— ${D.hisNick} ❤️ ${D.herNick}</small>
          </div>
        </div>
      </div>`).join('');
    $$('.pol').forEach((el) => el.addEventListener('click', () => el.classList.toggle('flipped')));
  }

  function renderGallery() {
    const fill = (id, list, who) => {
      $(id).innerHTML = list.map((p, i) => `<button class="g-item" data-i="${i}" aria-label="${who} photo ${i + 1}">${imgTag(p, who)}</button>`).join('');
      $$('.g-item', $(id)).forEach((b) => b.addEventListener('click', () => openLightbox(list, +b.dataset.i)));
    };
    const first = [D.galleryHer, D.her];
    const second = [D.galleryHim, D.his];
    fill('#gallery-a', first[0], first[1]);
    fill('#gallery-b', second[0], second[1]);
    $('#g-a-title').textContent = 'Starring ' + first[1];
    $('#g-b-title').textContent = 'Starring ' + second[1];
  }

  function openLightbox(list, i) {
    state.lbList = list; state.lbIndex = i; showLb();
    $('#lightbox').classList.remove('hidden');
  }
  function showLb() {
    const n = state.lbList.length;
    state.lbIndex = (state.lbIndex + n) % n;
    $('#lb-img').src = state.lbList[state.lbIndex].src;
  }

  function renderSongs() {
    // the intro sound (song 1) is NOT shown here — only your real songs
    $('#songs-grid').innerHTML = D.songs.map((s, i) => s.intro ? '' : `
      <button class="song" data-i="${i}">
        <span class="song-disc">🎵</span>
        <span class="song-text"><b>${s.title}</b><small>${s.artist}</small></span>
        <span class="song-state">▶ Play</span>
      </button>`).join('');
    $$('.song').forEach((b) => b.addEventListener('click', () => {
      const i = +b.dataset.i;
      if (state.song === i && !audio.paused) audio.pause(); else playSong(i, true);
    }));
  }

  function renderReasons() {
    $('#reasons-grid').innerHTML = D.reasons.map((r, i) => `
      <button class="reason">
        <div class="reason-inner">
          <div class="reason-face reason-front"><small>Reason #${i + 1}</small><b>${r.tag}</b></div>
          <div class="reason-face reason-back">${r.text}</div>
        </div>
      </button>`).join('');
    $$('.reason').forEach((el) => el.addEventListener('click', () => el.classList.toggle('flipped')));
  }

  function renderCast() {
    $('#cast-grid').innerHTML = D.cast.map((c) => `
      <button class="cast">
        <small>${c.role}</small>
        <h4>${c.name}</h4>
        <div class="award">${c.award}</div>
        <div class="egg">${c.egg}</div>
      </button>`).join('');
    $$('.cast').forEach((el) => el.addEventListener('click', () => el.classList.toggle('open')));
  }

  /* ---------------------------------------------------------------- music (4 song slots) */
  const audio = $('#bg-audio');
  const missing = {};

  // the intro sound (song 1) is only for the curtain — the player starts from song 2 and skips it
  const firstSong = () => Math.max(0, D.songs.findIndex((x) => !x.intro));
  const stepSong = (dir) => {
    const n = D.songs.length; let i = state.song;
    for (let k = 0; k < n; k++) { i = (i + dir + n) % n; if (!D.songs[i].intro) return i; }
    return state.song;
  };

  function refreshPlayerUi() {
    const s = D.songs[state.song];
    $('#player-title').textContent = s.title;
    $('#player-artist').textContent = missing[state.song] ? 'Song file not added yet' : s.artist;
    const playing = !audio.paused && !audio.ended;
    $('#pl-play').textContent = playing ? '❚❚' : '▶';
    $('#vinyl').classList.toggle('playing', playing);
    $('#eq').classList.toggle('playing', playing);
    $$('.song').forEach((b) => {
      const i = +b.dataset.i;
      b.classList.toggle('active', i === state.song);
      b.classList.toggle('missing', !!missing[i]);
      const st = $('.song-state', b);
      st.textContent = missing[i] ? 'Add song-' + (i + 1) + '.mp3' : (i === state.song && playing ? '❚❚ Playing' : '▶ Play');
    });
  }

  function playSong(i, autoplay) {
    const n = D.songs.length;
    state.song = (i + n) % n;
    audio.src = D.songs[state.song].src;
    missing[state.song] = false;
    refreshPlayerUi();
    if (autoplay) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => refreshPlayerUi());
    }
  }

  function initMusic() {
    audio.addEventListener('play', refreshPlayerUi);
    audio.addEventListener('pause', refreshPlayerUi);
    audio.addEventListener('ended', () => playSong(stepSong(1), true));
    audio.addEventListener('error', () => { missing[state.song] = true; refreshPlayerUi(); });
    $('#pl-play').addEventListener('click', () => {
      if (audio.paused) {
        if (!audio.src) playSong(state.song, true);
        else { const p = audio.play(); if (p && p.catch) p.catch(() => {}); }
        if (missing[state.song]) toast(`Add your song as assets/audio/song-${state.song + 1}.mp3 🎵`);
      } else audio.pause();
    });
    $('#pl-prev').addEventListener('click', () => playSong(stepSong(-1), true));
    $('#pl-next').addEventListener('click', () => playSong(stepSong(1), true));
    // initial UI (no autoplay until the first click on the splash)
    state.song = firstSong();
    audio.src = D.songs[state.song].src;
    refreshPlayerUi();
  }

  /* ---------------------------------------------------------------- page texts */
  function applyView() {
    const v = D.page;
    $('#hero-badge').textContent = v.badge;
    $('#hero-title').textContent = v.title;
    $('#hero-synopsis').textContent = v.synopsis;
    $('#watch-title').textContent = v.title;
    $('#watch-as').textContent = v.watchingAs;
    $('#info-title').textContent = v.title;
    $('#info-text').textContent = v.synopsis;
    $('#reasons-title').textContent = v.reasonsTitle;
    renderEpisodes(); renderPolaroids(); renderGallery(); renderReasons();
  }

  /* ---------------------------------------------------------------- dashboard wiring */
  function initDashboard() {
    $('#nav-brand').textContent = D.brand;
    $('#footer-brand').textContent = D.brand;
    $('#footer-since').textContent = D.startLabel;
    $('#footer-his').textContent = D.hisNick;
    $('#footer-her').textContent = D.herNick;
    $('#footer-dev').textContent = D.developer;
    $('#screen-dashboard').style.setProperty('--together', `url("${D.heroPhoto.src}")`);
    setImg($('#hero-img'), D.heroPhoto);
    $('#hero-blur').src = D.heroPhoto.src;
    $('#t-since').textContent = D.startLabel;
    $('#info-cast').textContent = D.her + ' & ' + D.his;
    $('#info-start').textContent = D.startLabel;

    renderSongs(); renderCast();
    applyView();

    // Sticky navbar
    const nav = $('#navbar');
    window.addEventListener('scroll', () => nav.classList.toggle('solid', window.scrollY > 40), { passive: true });

    // Notifications
    const bell = $('#bell-panel');
    $('#bell-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      updateTimer();
      $('#bell-list').innerHTML = [
        `🎉 Next anniversary: our ${state.nextLabel} (in ${state.nextIn}).`,
        `💌 Reminder: ${D.hisNick} loves ${D.herNick} more than yesterday.`,
        `🎬 Season 1 is ${state.days} days old — and renewed for infinite seasons!`
      ].map((t) => `<div class="bell-item">${t}</div>`).join('');
      bell.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => { if (!bell.contains(e.target)) bell.classList.add('hidden'); });

    $('#nav-profile').addEventListener('click', () => showScreen('profiles'));

    // Hero buttons
    $('#btn-play').addEventListener('click', () => openEpisode(0));
    $('#btn-info').addEventListener('click', () => $('#modal-info').classList.remove('hidden'));
    let listed = false;
    $('#btn-list').addEventListener('click', (e) => {
      listed = !listed;
      $('#list-icon').textContent = listed ? '✓' : '＋';
      $('#list-text').textContent = listed ? 'Added to My List ❤️' : 'My List / ❤️';
      if (listed) { burst(e.clientX, e.clientY); toast('Added to your list… forever ❤️'); }
    });
    $$('[data-egg]').forEach((el) => el.addEventListener('click', (e) => { toast(el.dataset.egg); burst(e.clientX, e.clientY, undefined, 8); }));

    // Episodes
    $('#btn-random').addEventListener('click', () => openEpisode(Math.floor(Math.random() * D.episodes.length)));
    $('#ep-prev').addEventListener('click', () => openEpisode(state.epIndex - 1));
    $('#ep-next').addEventListener('click', () => openEpisode(state.epIndex + 1));
    $('#ep-secret-btn').addEventListener('click', (e) => {
      $('#ep-secret').classList.remove('hidden');
      $('#ep-secret-btn').classList.add('hidden');
      burst(e.clientX, e.clientY);
    });

    // Secret letter (text lives in data.js -> secret.letter)
    const S = D.secret || {};
    $('#secret-eyebrow').textContent = S.eyebrow || '';
    $('#secret-title').textContent = S.title || '';
    $('#secret-hint').textContent = S.hint || '';
    $('#env-to').textContent = S.to || '';
    $('#letter-text').textContent = (S.letter || '').trim();      // blank paper if empty
    $('#letter-sign').textContent = (S.letter || '').trim() ? (S.from || '') : '';
    const env = $('#envelope'), paper = $('#letter-paper'), closeBtn = $('#letter-close');
    env.addEventListener('click', (e) => {
      env.classList.add('open');
      burst(e.clientX, e.clientY, ['❤️', '💌', '💖', '✨'], 12);
      setTimeout(() => {
        env.classList.add('hidden'); $('#secret-hint').classList.add('hidden');
        paper.classList.remove('hidden'); closeBtn.classList.remove('hidden');
        paper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 650);
    });
    closeBtn.addEventListener('click', () => {
      paper.classList.add('hidden'); closeBtn.classList.add('hidden');
      env.classList.remove('hidden', 'open'); $('#secret-hint').classList.remove('hidden');
    });

    // Polaroids
    $('#btn-flip-all').addEventListener('click', () => {
      const all = $$('.pol'); const anyUnflipped = all.some((p) => !p.classList.contains('flipped'));
      all.forEach((p) => p.classList.toggle('flipped', anyUnflipped));
    });

    // Modals / lightbox
    $$('#modal-episode [data-close], #modal-info [data-close]').forEach((el) => el.addEventListener('click', () => {
      $('#modal-episode').classList.add('hidden'); $('#modal-info').classList.add('hidden');
    }));
    $('#lightbox [data-close]').addEventListener('click', () => $('#lightbox').classList.add('hidden'));
    $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') $('#lightbox').classList.add('hidden'); });
    $('#lb-prev').addEventListener('click', (e) => { e.stopPropagation(); state.lbIndex--; showLb(); });
    $('#lb-next').addEventListener('click', (e) => { e.stopPropagation(); state.lbIndex++; showLb(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { $('#modal-episode').classList.add('hidden'); $('#modal-info').classList.add('hidden'); $('#lightbox').classList.add('hidden'); }
      if (!$('#lightbox').classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') { state.lbIndex--; showLb(); }
        if (e.key === 'ArrowRight') { state.lbIndex++; showLb(); }
      }
    });
  }

  /* ---------------------------------------------------------------- go */
  initSplash();
  initProfiles();
  initGate();
  initDashboard();
  initMusic();
  updateTimer();
  setInterval(updateTimer, 1000);
})();
