/*!
 * Video player UI (Plyr based). Loaded by the Worker through jsDelivr:
 *   <script src=".../player.js"></script>
 * Needs window.__PLAYER__ = { videoId, title, poster, sources, vttText, color, downloadName }
 * player.css is loaded automatically from the same folder.
 */
(function () {
  const C = window.__PLAYER__ || {};
  const SELF = document.currentScript ? document.currentScript.src : "";

// Loading animation (inline SVG so its gradient colors can follow the bar color via --ld-c1..5)
const LOADING_SVG = `<svg fill="none" height="100%" width="100%" viewBox="0 0 500 500" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ldGrad" gradientUnits="userSpaceOnUse" spreadMethod="pad" x2="200.808" y2="8.27" x1="-179.993" y1="-7.325"><stop offset="1.3%" style="stop-color:var(--ld-c1,#fa11f7)" stop-color="#fa11f7" /><stop offset="17.6%" style="stop-color:var(--ld-c2,#871eea)" stop-color="#871eea" /><stop offset="51.7%" style="stop-color:var(--ld-c3,#132bdd)" stop-color="#132bdd" /><stop offset="84.9%" style="stop-color:var(--ld-c4,#0f7cee)" stop-color="#0f7cee" /><stop offset="98.8%" style="stop-color:var(--ld-c5,#0bceff)" stop-color="#0bceff" /></linearGradient><mask height="20000" width="20000" y="-10000" x="-10000" maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse" style="mask-type: alpha" mask-type="alpha" id="ldMask"><g transform="matrix(0.139,0.99,-0.99,0.139,266.203,214.399)"><g transform="matrix(1,0,0,1,33,21)"><path stroke-width="80" stroke="#656565" d="M114.51,-123.744C146.607,-89.059,169.938,-47.581,171.367,2.023C172.49,46.089,157.4,90.088,123.744,123.744C89.573,157.915,44.786,175,0,175C-44.786,175,-89.573,157.915,-123.744,123.744C-157.409,90.079,-171.796,46.1,-171.368,1.989C-170.902,-44.204,-151.44,-87.098,-114.51,-123.744C-81.2,-156.822,-40.827,-175.253,0.925,-174.997C42.061,-174.745,83.124,-157.661,114.51,-123.744Z"><animate repeatCount="indefinite" attributeName="d" dur="2.2s" begin="0s" calcMode="spline" values="M123.744,-123.744C158.429,-89.059,175.51,-43.435,174.988,2.023C174.481,46.133,157.4,90.088,123.744,123.744C89.573,157.915,44.786,175,0,175C-44.786,175,-89.573,157.915,-123.744,123.744C-157.409,90.079,-174.491,46.11,-174.989,1.989C-175.502,-43.458,-158.421,-89.067,-123.744,-123.744C-89.319,-158.169,-44.119,-175.253,1,-174.997C45.453,-174.745,89.827,-157.661,123.744,-123.744Z; M104.67,-123.744C134.009,-89.059,164,-52,167.509,2.023C170.368,46.043,157.4,90.088,123.744,123.744C89.573,157.915,44.786,175,0,175C-44.786,175,-89.573,157.915,-123.744,123.744C-157.409,90.079,-168.925,46.09,-167.509,1.989C-166,-45,-144,-85,-104.669,-123.744C-72.547,-155.386,-37.318,-175.253,0.846,-174.997C38.446,-174.745,75.981,-157.661,104.67,-123.744Z; M45.667,-121.487C70.73,-92.281,110.99,-53.442,136.52,2.023C154,40,157.4,90.088,123.744,123.744C89.573,157.915,44.786,175,0,175C-44.786,175,-89.573,157.915,-123.744,123.744C-157.409,90.079,-156,45,-135.873,1.989C-116.542,-39.321,-82,-81,-44.646,-123.975C-14.287,-158.902,-19.025,-174.993,0.846,-174.997C16,-175,14.333,-158,45.667,-121.487Z; M-39.056,-121.487C-36,-66,0,-43,72.64,2.023C115.564,28.628,131,84,106.133,123.744C82.255,161.907,44.786,175,0,175C-44.786,175,-81.578,161.475,-106.134,123.744C-132,84,-119,30,-73.222,1.989C-36.896,-20.239,42,-47,46.384,-123.975C47.68,-146.734,21,-174,0.846,-174.997C-14.289,-175.746,-40.28,-143.703,-39.056,-121.487Z; M-101.976,-121.487C-124.11,-72.284,-86,-39,-33.24,2.023C15.454,39.884,50,69,49.37,123.744C49.056,151.001,23.722,175,0,175C-23.846,175,-47,155,-49.903,123.744C-53.745,82.378,-11,35,32.594,1.989C76.215,-31.043,132,-78,105.196,-123.95C84.302,-159.768,53,-176,0.846,-174.997C-55.099,-173.921,-86,-157,-101.976,-121.487Z; M-119.976,-121.975C-151,-85,-145,-30,-113.24,2.046C-69.09,46.593,-24.299,74.613,0.37,123.487C13.5,149.5,12.072,174.29,0,175C-8.5,175.5,-18,157.5,0.097,123.487C19.611,86.811,66.189,45.299,108.594,1.977C135,-25,158,-77,119.196,-123.899C92.762,-155.847,53,-176,0.846,-174.997C-55.098,-173.921,-94.946,-151.806,-119.976,-121.975Z; M-124.976,-121.975C-164,-79,-170.27,-40.797,-161.948,2.046C-147,79,-78,78,-35.183,123.975C-14.66,146.012,0,165,0,175C0,181,8.022,149.798,38.452,123.949C69,98,146,75,159.711,1.977C167.845,-41.344,170,-78,124.196,-123.899C94.905,-153.25,53,-176,0.846,-174.997C-55.098,-173.921,-98.798,-150.803,-124.976,-121.975Z; M-123.381,-123.744C-157.967,-89.059,-180.613,-41.835,-173.229,3.023C-165.25,51.5,-135.18,92.082,-104.539,123.744C-68,161.5,-27,175,0.009,175C24.006,175,67,157,104.557,123.744C137.552,94.527,171,44.5,173.497,1.989C176.162,-43.383,157.975,-89.067,123.398,-123.744C89.071,-158.169,44.001,-175.253,-0.989,-174.997C-45.314,-174.745,-89.561,-157.661,-123.381,-123.744Z; M-123.381,-123.744C-157.967,-89.059,-175,-43.435,-174.479,2.023C-173.974,46.133,-156.941,90.088,-123.381,123.744C-89.308,157.915,-44.649,175,0.009,175C44.667,175,89.325,157.915,123.398,123.744C156.967,90.079,174,46.11,174.497,1.989C175.009,-43.458,157.975,-89.067,123.398,-123.744C89.071,-158.169,44.001,-175.253,-0.989,-174.997C-45.314,-174.745,-89.561,-157.661,-123.381,-123.744Z; M123.744,-123.744C158.429,-89.059,175.51,-43.435,174.988,2.023C174.481,46.133,157.4,90.088,123.744,123.744C89.573,157.915,44.786,175,0,175C-44.786,175,-89.573,157.915,-123.744,123.744C-157.409,90.079,-174.491,46.11,-174.989,1.989C-175.502,-43.458,-158.421,-89.067,-123.744,-123.744C-89.319,-158.169,-44.119,-175.253,1,-174.997C45.453,-174.745,89.827,-157.661,123.744,-123.744Z; M104.67,-123.744C134.009,-89.059,164,-52,167.509,2.023C170.368,46.043,157.4,90.088,123.744,123.744C89.573,157.915,44.786,175,0,175C-44.786,175,-89.573,157.915,-123.744,123.744C-157.409,90.079,-168.925,46.09,-167.509,1.989C-166,-45,-144,-85,-104.669,-123.744C-72.547,-155.386,-37.318,-175.253,0.846,-174.997C38.446,-174.745,75.981,-157.661,104.67,-123.744Z; M45.667,-121.487C70.73,-92.281,110.99,-53.442,136.52,2.023C154,40,157.4,90.088,123.744,123.744C89.573,157.915,44.786,175,0,175C-44.786,175,-89.573,157.915,-123.744,123.744C-157.409,90.079,-156,45,-135.873,1.989C-116.542,-39.321,-82,-81,-44.646,-123.975C-14.287,-158.902,-19.025,-174.993,0.846,-174.997C16,-175,14.333,-158,45.667,-121.487Z; M-39.056,-121.487C-36,-66,0,-43,72.64,2.023C115.564,28.628,131,84,106.133,123.744C82.255,161.907,44.786,175,0,175C-44.786,175,-81.578,161.475,-106.134,123.744C-132,84,-119,30,-73.222,1.989C-36.896,-20.239,42,-47,46.384,-123.975C47.68,-146.734,21,-174,0.846,-174.997C-14.289,-175.746,-40.28,-143.703,-39.056,-121.487Z; M-101.976,-121.487C-124.11,-72.284,-86,-39,-33.24,2.023C15.454,39.884,50,69,49.37,123.744C49.056,151.001,23.722,175,0,175C-23.846,175,-47,155,-49.903,123.744C-53.745,82.378,-11,35,32.594,1.989C76.215,-31.043,132,-78,105.196,-123.95C84.303,-159.768,53,-176,0.846,-174.997C-55.099,-173.921,-86,-157,-101.976,-121.487Z; M-119.976,-121.975C-151,-85,-145,-30,-113.24,2.046C-69.09,46.593,-24.299,74.613,0.37,123.487C13.5,149.5,12.072,174.29,0,175C-8.5,175.5,-18,157.5,0.097,123.487C19.611,86.811,66.189,45.299,108.594,1.977C135,-25,158,-77,119.196,-123.899C92.762,-155.847,53,-176,0.846,-174.997C-55.098,-173.921,-94.946,-151.806,-119.976,-121.975Z; M-124.976,-121.975C-164,-79,-170.27,-40.797,-161.948,2.046C-147,79,-78,78,-35.183,123.975C-14.66,146.012,0,165,0,175C0,181,8.022,149.798,38.452,123.949C69,98,146,75,159.711,1.977C167.845,-41.344,170,-78,124.196,-123.899C94.905,-153.25,53,-176,0.846,-174.997C-55.098,-173.921,-98.798,-150.803,-124.976,-121.975Z; M-123.381,-123.744C-157.967,-89.059,-180.613,-41.835,-173.229,3.023C-165.25,51.5,-135.18,92.082,-104.539,123.744C-68,161.5,-27,175,0.009,175C24.006,175,67,157,104.557,123.744C137.552,94.527,171,44.5,173.497,1.989C176.162,-43.383,157.975,-89.067,123.398,-123.744C89.071,-158.169,44.001,-175.253,-0.989,-174.997C-45.314,-174.745,-89.561,-157.661,-123.381,-123.744Z; M-123.381,-123.744C-157.967,-89.059,-175,-43.435,-174.479,2.023C-173.974,46.133,-156.941,90.088,-123.381,123.744C-89.308,157.915,-44.649,175,0.009,175C44.667,175,89.325,157.915,123.398,123.744C156.967,90.079,174,46.11,174.497,1.989C175.009,-43.458,157.975,-89.067,123.398,-123.744C89.071,-158.169,44.001,-175.253,-0.989,-174.997C-45.314,-174.745,-89.561,-157.661,-123.381,-123.744Z; M-123.381,-123.744C-157.967,-89.059,-175,-43.435,-174.479,2.023C-173.974,46.133,-156.941,90.088,-123.381,123.744C-89.308,157.915,-44.649,175,0.009,175C44.667,175,89.325,157.915,123.398,123.744C156.967,90.079,174,46.11,174.497,1.989C175.009,-43.458,157.975,-89.067,123.398,-123.744C89.071,-158.169,44.001,-175.253,-0.989,-174.997C-45.314,-174.745,-89.561,-157.661,-123.381,-123.744Z" keyTimes="0; 0.016529; 0.049587; 0.07438; 0.107438; 0.132232; 0.157025; 0.190082; 0.22314; 0.231405; 0.256199; 0.289256; 0.314049; 0.347107; 0.371901; 0.396694; 0.429752; 0.471074; 1" keySplines="0.333 0 0.833 0.833; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0.167 0.167 0.667 1; 0 0 1 1; 0.333 0 0.833 0.833; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0 0 1 1; 0.167 0.167 0.667 1; 0 0 1 1" fill="freeze" /></path></g></g></mask></defs><g mask="url(#ldMask)"><g transform="translate(250,250)"><g transform="rotate(135)"><animateTransform repeatCount="indefinite" type="rotate" attributeName="transform" dur="2.2s" begin="0s" calcMode="spline" values="135; 360; 360" keyTimes="0; 0.991736; 1" keySplines="0 0 1 1; 0 0 1 1" fill="freeze" /><g transform="scale(1,1) translate(-33,-21)"><g transform="matrix(1,0,0,1,33,21)"><path fill="url(#ldGrad)" d="M155.36,-155.329C198.908,-111.781,220.355,-54.501,219.699,2.572C219.063,57.952,197.616,113.138,155.36,155.394C112.458,198.296,56.229,219.747,-0.001,219.747C-56.231,219.747,-112.461,198.296,-155.363,155.394C-197.63,113.127,-219.075,57.924,-219.701,2.529C-220.345,-54.53,-198.9,-111.792,-155.363,-155.329C-112.142,-198.55,-55.394,-220,1.254,-219.678C57.065,-219.361,112.777,-197.912,155.36,-155.329Z" /></g></g></g></g></g></svg>`;
// Default palette = the colors of the loading SVG gradient (seekbar uses the same colors)
const SVG_PALETTE = ["#fa11f7", "#871eea", "#132bdd", "#0f7cee", "#0bceff"];
const SVG_MAIN_COLOR = "#871eea";


const initialColor = C.color || SVG_MAIN_COLOR;
const barPalette = C.color ? Array(5).fill(C.color) : SVG_PALETTE;

function addCss(href) {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  document.head.appendChild(l);
}
function addScript(src, onload) {
  const el = document.createElement("script");
  el.src = src;
  el.onload = onload;
  document.head.appendChild(el);
}

const MARKUP = `  <div class="player-container" id="playerContainer">
    <div class="top-toolbar" id="topToolbar">
      <button class="glass-btn" id="lockBtn" title="Lock Screen">
        <svg id="lockIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </button>
    </div>

    <label class="s-item" id="colorRow"><span class="s-ico"><span class="material-symbols-outlined">palette</span></span><span class="s-label">Bar color</span><button type="button" id="barColorReset" title="Reset to default colors" aria-label="Reset bar color"><svg viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button><input type="color" id="barColorPicker" value="${initialColor}" aria-label="Change bar color" /></label>

    <div class="brightness-overlay" id="brightnessOverlay"></div>
    <div class="lock-shield" id="lockShield"></div>

    <div class="mini-preview" id="miniPreview">
      <div class="mini-preview-frame" id="miniPreviewFrame">
        <div class="mini-preview-sprite" id="miniPreviewSprite"></div>
        <video class="mini-preview-video" id="miniPreviewVideo" muted playsinline preload="auto"></video>
      </div>
      <div class="mini-preview-time" id="miniPreviewTime">00:00 / 00:00</div>
    </div>

    <div class="gesture-hud" id="gestureHud">
      <span id="hudIcon"></span>
      <span id="hudText"></span>
    </div>

    <video id="player" playsinline controls></video>

    <div class="video-loader" id="videoLoader" aria-hidden="true">${LOADING_SVG}</div>

    <div class="scrub-delta" id="scrubDelta" aria-hidden="true"><span class="sd-delta" id="scrubDeltaText"></span><span class="sd-time" id="scrubTimeText"></span></div>

    <div id="rewindAnim" class="seek-overlay left">
      <span class="material-symbols-outlined">replay_10</span>
      <span></span>
    </div>

    <div id="forwardAnim" class="seek-overlay right">
      <span></span>
      <span class="material-symbols-outlined">forward_10</span>
    </div>
  </div>`;
document.body.insertAdjacentHTML("afterbegin", MARKUP);

addCss("https://cdn.plyr.io/3.7.8/plyr.css");
addCss("https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700&display=swap");
addCss("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=4k,brightness_6,download,expand_content,forward_10,light_mode,no_sound,palette,replay_10,volume_down,volume_mute,volume_up");
addCss(new URL("player.css", SELF).href);

// Custom ?color= : override the default palette variables (added after the CSS links so it wins)
if (C.color) {
  const st = document.createElement("style");
  st.textContent = ":root{--plyr-color-main:" + initialColor + ";--bar-grad:linear-gradient(to right," + barPalette.join(",") + ");"
    + barPalette.map((c, i) => "--ld-c" + (i + 1) + ":" + c).join(";") + "}";
  document.head.appendChild(st);
}

addScript("https://cdn.plyr.io/3.7.8/plyr.polyfilled.js", boot);

function boot() {
    // 1. Initialize Plyr
    const videoId = C.videoId;
    const sources = C.sources;
    const vttText = (C.vttText || "");

    const videoEl = document.getElementById("player");

    // Quality: we choose the start source BEFORE initializing Plyr so Plyr does not detach videoEl
    function pickInitialQuality() {
      const sizes = [...new Set(sources.map((s) => s.size))].sort((a, b) => b - a);
      let saved = 0;
      try { saved = parseInt(localStorage.getItem("qualityPref"), 10) || 0; } catch (e) {}
      if (saved && sizes.includes(saved)) return saved;
      return sizes.find((size) => size <= 720) || sizes[sizes.length - 1];
    }
    let currentQualitySize = pickInitialQuality();
    let qualitySwitchToken = 0;
    let qualitySwitching = false;
    const initialSource = sources.find((s) => s.size === currentQualitySize) || sources[0];
    const initialPoster = (C.poster || "");

    if (initialSource) videoEl.src = initialSource.src;
    if (initialPoster) videoEl.poster = initialPoster;

    const player = new Plyr(videoEl, {
      title: C.title,
      seekTime: 10,
      clickToPlay: false,
      fullscreen: { enabled: true, fallback: true, iosNative: false },
      controls: [
        "play-large", "rewind", "play", "fast-forward",
        "progress", "current-time", "duration", "mute",
        "volume", "fullscreen"
      ]
    });

    // Mount all custom UI INSIDE Plyr's container
    const container = player.elements.container;
    const topToolbar = document.getElementById("topToolbar");
    const brightnessOverlay = document.getElementById("brightnessOverlay");
    const lockShield = document.getElementById("lockShield");
    const miniPreview = document.getElementById("miniPreview");
    const gestureHud = document.getElementById("gestureHud");
    const rewindAnim = document.getElementById("rewindAnim");
    const forwardAnim = document.getElementById("forwardAnim");

    container.appendChild(brightnessOverlay);
    container.appendChild(topToolbar);
    container.appendChild(lockShield);
    container.appendChild(miniPreview);
    container.appendChild(gestureHud);
    container.appendChild(rewindAnim);
    container.appendChild(forwardAnim);

    // Loading animation: shown only while the video is really waiting for data
    const videoLoader = document.getElementById("videoLoader");
    container.appendChild(videoLoader);

    // Scrub indicator: shows how far ahead (+) / behind (-) the seekbar drag is, and the target time
    const scrubDelta = document.getElementById("scrubDelta");
    const scrubDeltaText = document.getElementById("scrubDeltaText");
    const scrubTimeText = document.getElementById("scrubTimeText");
    container.appendChild(scrubDelta);
    let scrubOrigin = null;   // video time when the drag started
    function fmtClock(sec) {
      sec = Math.max(0, Math.floor(sec));
      const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
      const mm = h ? String(m).padStart(2, "0") : String(m);
      return (h ? h + ":" : "") + mm + ":" + String(s).padStart(2, "0");
    }
    function fmtDelta(diff) {
      const a = Math.abs(Math.round(diff));
      if (a === 0) return "0s";
      const sign = diff > 0 ? "+" : "\u2212";
      return sign + (a < 60 ? a + "s" : fmtClock(a));
    }
    function showScrubDelta(targetSec, originSec) {
      if (originSec === null || originSec === undefined || isNaN(targetSec) || isNaN(originSec)) return;
      scrubDeltaText.textContent = fmtDelta(targetSec - originSec);
      scrubTimeText.textContent = fmtClock(targetSec);
      scrubDelta.classList.add("show");
    }
    function hideScrubDelta() {
      scrubOrigin = null;
      scrubDelta.classList.remove("show");
    }
    function updateLoader() {
      const m = player.media || videoEl;
      if (m.readyState >= 3 || m.error) qualitySwitching = false;
      const waiting = !m.ended && !m.error && m.readyState < 3 && (!m.paused || m.seeking || qualitySwitching);
      // Dual loading: center SVG runs together with Plyr's default bottom loading (plyr--loading)
      const show = waiting || (!m.ended && !m.error && container.classList.contains("plyr--loading"));
      if (container.classList.contains("is-loading") !== show) container.classList.toggle("is-loading", show);
    }
    new MutationObserver(updateLoader).observe(container, { attributes: true, attributeFilter: ["class"] });
    ["loadstart", "waiting", "stalled", "seeking", "seeked", "canplay", "canplaythrough",
     "loadeddata", "playing", "play", "pause", "ended", "emptied", "error", "timeupdate"
    ].forEach((ev) => videoEl.addEventListener(ev, updateLoader));

    // 1A. Unified settings menu (YouTube-style gear): every secondary control lives inside it
    const DOWNLOAD_ICON_HTML = '<span class="material-symbols-outlined">download</span>';
    function mIcon(inner) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }
    const MENU_ICONS = {
      gear: mIcon('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'),
      speed: mIcon('<path d="M12 14l4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path>'),
      quality: mIcon('<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"></path><circle cx="15" cy="6" r="2"></circle><circle cx="9" cy="12" r="2"></circle><circle cx="17" cy="18" r="2"></circle>'),
      fourk: '<span class="material-symbols-outlined">4k</span>',
      download: mIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>'),
      pip: mIcon('<rect x="2" y="4" width="20" height="14" rx="2"></rect><rect x="12" y="11" width="7" height="5" rx="1"></rect>'),
      airplay: mIcon('<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>'),
      lock: mIcon('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>'),
      chevron: mIcon('<polyline points="9 18 15 12 9 6"></polyline>'),
      back: mIcon('<polyline points="15 18 9 12 15 6"></polyline>'),
      check: mIcon('<polyline points="20 6 9 17 4 12"></polyline>')
    };

    const settingsMenu = document.createElement("div");
    settingsMenu.className = "s-menu";
    settingsMenu.id = "settingsMenu";
    container.appendChild(settingsMenu);
    const colorRow = document.getElementById("colorRow");
    let settingsBtn = null;
    let settingsPage = "main";
    let beforeFourK = null;
    const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    // UI labels shown to the viewer (real server size -> label). Edit freely; streams are unchanged.
    const QUALITY_LABELS = { 240: "360p", 360: "480p", 480: "720p", 720: "1080p", 1080: "4K" };
    function qualityLabel(size) { return QUALITY_LABELS[size] || (size + "p"); }

    function onQualityChanged() {
      if (settingsMenu.classList.contains("show")) renderSettings();
    }

    // Swap the video source, then restore time, speed and play state
    function switchQuality(size) {
      const target = sources.find((s) => s.size === size);
      const media = player.media || videoEl;
      if (!target || !media || size === currentQualitySize) return;
      const resumeAt = media.currentTime || 0;
      const wasPaused = media.paused;
      const rate = media.playbackRate || 1;
      const token = ++qualitySwitchToken;
      currentQualitySize = size;
      try { localStorage.setItem("qualityPref", String(size)); } catch (e) {}

      media.querySelectorAll("source").forEach((el) => el.remove());

      media.addEventListener("loadedmetadata", function restore() {
        if (token !== qualitySwitchToken) return;
        media.playbackRate = rate;
        if (resumeAt > 0) {
          try { media.currentTime = resumeAt; } catch (e) {}
        }
        if (!wasPaused) {
          const p = media.play();
          if (p && p.catch) p.catch(function () {});
        }
      }, { once: true });

      media.addEventListener("canplay", function restoreCanPlay() {
        if (token !== qualitySwitchToken) return;
        if (resumeAt > 0 && Math.abs((media.currentTime || 0) - resumeAt) > 1.5) {
          try { media.currentTime = resumeAt; } catch (e) {}
        }
        if (!wasPaused && media.paused) {
          const p = media.play();
          if (p && p.catch) p.catch(function () {});
        }
      }, { once: true });

      media.src = target.src;
      media.load();
      qualitySwitching = !wasPaused;
      updateLoader();
      onQualityChanged();
    }

    function qualitySizes() {
      return [...new Set(sources.map((s) => s.size))].sort((a, b) => b - a);
    }

    function startDownload(size) {
      // Direct link to the video host: no Worker bandwidth/CPU is used
      const src = sources.find((s) => s.size === size);
      if (!src) return;
      const a = document.createElement("a");
      a.href = src.src;
      a.download = C.downloadName + "_" + size + "p.mp4";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
      hudIcon.innerHTML = DOWNLOAD_ICON_HTML;
      hudText.textContent = "Downloading " + qualityLabel(size);
      gestureHud.classList.add("show");
      hideHud(1800);
    }

    function fourKSize() {
      return qualitySizes().find((size) => qualityLabel(size) === "4K");
    }

    function toggleFourK() {
      const k = fourKSize();
      if (!k) return;
      const cur = currentQualitySize || 0;
      if (cur === k) {
        const back = beforeFourK && beforeFourK !== k ? beforeFourK : qualitySizes().find((size) => size < k);
        if (back) switchQuality(back);
      } else {
        beforeFourK = cur;
        switchQuality(k);
      }
    }

    function pipSupported() {
      return Boolean(document.pictureInPictureEnabled || (videoEl && typeof videoEl.webkitSetPresentationMode === "function"));
    }
    function airplaySupported() { return Boolean(window.WebKitPlaybackTargetAvailabilityEvent); }
    function currentSpeed() { try { return Number(player.speed) || 1; } catch (e) { return 1; } }
    function speedLabel(v) { return v === 1 ? "Normal" : v + "x"; }
    function isPipOn() { try { return Boolean(player.pip); } catch (e) { return false; } }
    function switchHtml(on) { return '<span class="s-switch' + (on ? ' on' : '') + '"></span>'; }

    function sRow(icon, label, valueHtml, onClick, chevron) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "s-item";
      b.innerHTML = '<span class="s-ico">' + icon + '</span><span class="s-label">' + label + '</span>'
        + (valueHtml ? (valueHtml.indexOf("<") === 0 ? valueHtml : '<span class="s-val">' + valueHtml + '</span>') : '')
        + (chevron ? '<span class="s-chev">' + MENU_ICONS.chevron + '</span>' : '');
      b.addEventListener("click", function (e) { e.stopPropagation(); onClick(); });
      return b;
    }

    function sHead(title) {
      const h = document.createElement("button");
      h.type = "button";
      h.className = "s-item s-head";
      h.innerHTML = '<span class="s-ico">' + MENU_ICONS.back + '</span><span class="s-label">' + title + '</span>';
      h.addEventListener("click", function (e) { e.stopPropagation(); goPage("main"); });
      return h;
    }

    function sOption(label, active, icon, onClick) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "s-item s-opt" + (active ? " active" : "");
      b.innerHTML = '<span class="s-ico">' + (active ? MENU_ICONS.check : (icon || "")) + '</span><span class="s-label">' + label + '</span>';
      b.addEventListener("click", function (e) { e.stopPropagation(); onClick(); });
      return b;
    }

    function goPage(p) {
      settingsPage = p;
      renderSettings();
    }

    function renderSettings() {
      settingsMenu.innerHTML = "";
      const page = document.createElement("div");
      page.className = "s-page";

      if (settingsPage === "speed") {
        page.appendChild(sHead("Playback speed"));
        const cur = currentSpeed();
        SPEEDS.forEach(function (v) {
          page.appendChild(sOption(speedLabel(v), v === cur, "", function () {
            try { player.speed = v; } catch (err) {}
            hideSettings();
          }));
        });
      } else if (settingsPage === "quality") {
        page.appendChild(sHead("Quality"));
        qualitySizes().forEach(function (size) {
          page.appendChild(sOption(qualityLabel(size), size === currentQualitySize, "", function () {
            switchQuality(size);
            hideSettings();
          }));
        });
      } else if (settingsPage === "download") {
        page.appendChild(sHead("Download"));
        qualitySizes().forEach(function (size) {
          page.appendChild(sOption(qualityLabel(size), false, MENU_ICONS.download, function () {
            hideSettings();
            startDownload(size);
          }));
        });
      } else {
        page.appendChild(sRow(MENU_ICONS.speed, "Playback speed", speedLabel(currentSpeed()), function () { goPage("speed"); }, true));
        if (qualitySizes().length >= 2) {
          page.appendChild(sRow(MENU_ICONS.quality, "Quality", qualityLabel(currentQualitySize), function () { goPage("quality"); }, true));
        }
        if (fourKSize()) {
          page.appendChild(sRow(MENU_ICONS.fourk, "4K", switchHtml(currentQualitySize === fourKSize()), function () { toggleFourK(); }, false));
        }
        if (qualitySizes().length >= 1) {
          page.appendChild(sRow(MENU_ICONS.download, "Download", "", function () { goPage("download"); }, true));
        }
        if (pipSupported()) {
          page.appendChild(sRow(MENU_ICONS.pip, "Picture in picture", switchHtml(isPipOn()), function () {
            hideSettings();
            try { player.pip = !player.pip; } catch (err) {}
          }, false));
        }
        if (airplaySupported()) {
          page.appendChild(sRow(MENU_ICONS.airplay, "AirPlay", "", function () {
            hideSettings();
            try { player.airplay(); } catch (err) {}
          }, false));
        }
        if (colorRow) page.appendChild(colorRow);
        page.appendChild(sRow(MENU_ICONS.lock, "Lock screen", "", function () {
          hideSettings();
          document.getElementById("lockBtn").click();
        }, false));
      }
      settingsMenu.appendChild(page);
    }

    function positionSettingsMenu() {
      if (!settingsBtn) return;
      const cRect = container.getBoundingClientRect();
      const bRect = settingsBtn.getBoundingClientRect();
      settingsMenu.style.bottom = Math.max(30, cRect.bottom - bRect.top + 10) + "px";
      settingsMenu.style.right = Math.max(8, cRect.right - bRect.right - 4) + "px";
    }

    function showSettings() {
      settingsPage = "main";
      renderSettings();
      positionSettingsMenu();
      settingsMenu.classList.add("show");
      if (settingsBtn) settingsBtn.setAttribute("aria-expanded", "true");
    }

    function hideSettings() {
      settingsMenu.classList.remove("show");
      if (settingsBtn) settingsBtn.setAttribute("aria-expanded", "false");
    }

    function mountSettingsButton() {
      if (settingsBtn && settingsBtn.isConnected) return;
      const controls = player.elements.controls;
      if (!controls) return;
      settingsBtn = document.createElement("button");
      settingsBtn.type = "button";
      settingsBtn.id = "settingsBtn";
      settingsBtn.className = "plyr__controls__item plyr__control";
      settingsBtn.setAttribute("data-plyr", "settings-btn");
      settingsBtn.setAttribute("aria-label", "Settings");
      settingsBtn.setAttribute("aria-expanded", "false");
      settingsBtn.innerHTML = MENU_ICONS.gear;
      settingsBtn.addEventListener("click", function () {
        if (settingsMenu.classList.contains("show")) hideSettings();
        else showSettings();
      });
      const fs = controls.querySelector('[data-plyr="fullscreen"]');
      if (fs && fs.parentNode) fs.parentNode.insertBefore(settingsBtn, fs);
      else controls.appendChild(settingsBtn);
    }

    mountSettingsButton();
    player.on("ready", mountSettingsButton);
    player.on("loadedmetadata", mountSettingsButton);
    // Keep the controls on screen while the menu is open instead of closing it under the viewer
    player.on("controlshidden", function () {
      if (!settingsMenu.classList.contains("show")) return;
      setTimeout(function () {
        try { player.toggleControls(true); } catch (err) { hideSettings(); }
      }, 0);
    });
    window.addEventListener("resize", function () {
      if (settingsMenu.classList.contains("show")) positionSettingsMenu();
    });

    // 1A-4. Mute/volume button icons (Material Symbols: no_sound, volume_mute, volume_down, volume_up)
    function volumeIconName() {
      let v = 1, muted = false;
      try { v = Number(player.volume); muted = Boolean(player.muted); } catch (e) {}
      if (muted || !v) return "no_sound";
      if (v < 0.34) return "volume_mute";
      if (v < 0.67) return "volume_down";
      return "volume_up";
    }

    function updateVolumeIcon() {
      const glyph = document.getElementById("volIconGlyph");
      if (!glyph) return;
      const name = volumeIconName();
      if (glyph.textContent !== name) glyph.textContent = name;
    }

    function mountVolumeIcon() {
      const controls = player.elements.controls;
      if (!controls) return;
      const btn = controls.querySelector('[data-plyr="mute"]');
      if (!btn || btn.querySelector("#volIconGlyph")) return;
      btn.classList.add("has-vol-icon");
      const glyph = document.createElement("span");
      glyph.id = "volIconGlyph";
      glyph.className = "material-symbols-outlined";
      btn.appendChild(glyph);
      updateVolumeIcon();
    }

    function mountSeekIcons() {
      const controls = player.elements.controls;
      if (!controls) return;
      [["rewind", "replay_10"], ["fast-forward", "forward_10"]].forEach(function (pair) {
        const btn = controls.querySelector('[data-plyr="' + pair[0] + '"]');
        if (!btn || btn.querySelector(".m-seek-glyph")) return;
        btn.classList.add("has-m-icon");
        const g = document.createElement("span");
        g.className = "material-symbols-outlined m-seek-glyph";
        g.textContent = pair[1];
        btn.insertBefore(g, btn.firstChild);
      });
    }
    mountSeekIcons();
    player.on("ready", mountSeekIcons);
    player.on("loadedmetadata", mountSeekIcons);

    mountVolumeIcon();
    player.on("ready", mountVolumeIcon);
    player.on("loadedmetadata", mountVolumeIcon);
    player.on("volumechange", updateVolumeIcon);

    // Close the menu when tapping anywhere outside it
    document.addEventListener("pointerdown", (e) => {
      if (settingsMenu.classList.contains("show")
          && !e.target.closest("#settingsMenu") && !e.target.closest("#settingsBtn")) {
        hideSettings();
      }
    }, true);

    // UI scale comes from the --ui CSS variable (single place to resize everything)
    function uiScale() {
      let v = 0;
      try { v = parseFloat(getComputedStyle(container).getPropertyValue("--ui")); } catch (e) {}
      return v > 0 ? v : 1;
    }

    // 1B. Custom Seekbar Mini Preview (VTT Sprite + Properly Queued Low-Res Video Fallback)
    const miniPreviewFrame = document.getElementById("miniPreviewFrame");
    const miniPreviewSprite = document.getElementById("miniPreviewSprite");
    const miniPreviewVideo = document.getElementById("miniPreviewVideo");
    const miniPreviewTime = document.getElementById("miniPreviewTime");

    function parseVttTime(str) {
      const clean = str.trim().replace(",", ".");
      const parts = clean.split(":");
      if (parts.length === 3) {
        return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
      } else if (parts.length === 2) {
        return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
      } else if (parts.length === 1) {
        return parseFloat(parts[0]) || 0;
      }
      return 0;
    }

    function parseVttCues(raw) {
      if (!raw) return [];
      const lines = raw.replace(/^\uFEFF/, "").split(/\r?\n/).map((l) => l.trim());
      const cues = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || !line.includes("-->")) continue;
        const parts = line.split("-->");
        if (parts.length < 2) continue;
        const startStr = parts[0].trim().split(/\s+/)[0];
        const endStr = parts[1].trim().split(/\s+/)[0];

        let payload = "";
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j]) {
            if (!lines[j].includes("-->")) {
              payload = lines[j];
              i = j;
            }
            break;
          }
        }
        if (!payload) continue;

        const [imgUrl, xywh] = payload.split(/#xywh=(?:pixel:)?/i);
        const cue = {
          start: parseVttTime(startStr),
          end: parseVttTime(endStr),
          url: imgUrl.trim(),
          x: 0, y: 0, w: 0, h: 0
        };
        if (xywh) {
          const nums = xywh.split(",").map((n) => parseFloat(n));
          if (nums.length === 4 && nums.every((n) => !isNaN(n))) {
            [cue.x, cue.y, cue.w, cue.h] = nums;
          }
        }
        cues.push(cue);
      }
      return cues;
    }

    function formatPreviewTime(sec) {
      sec = Math.max(0, Math.floor(sec || 0));
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      const mm = String(m).padStart(2, "0");
      const ss = String(s).padStart(2, "0");
      return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
    }

    const vttCues = parseVttCues(vttText);
    const spriteCache = {};
    let spriteReady = false;
    let spriteFailed = false;

    if (vttCues.length > 0) {
      const uniqueUrls = [...new Set(vttCues.map((c) => c.url))];
      uniqueUrls.forEach((url) => {
        const img = new Image();
        img.onload = () => {
          spriteCache[url] = { w: img.naturalWidth, h: img.naturalHeight };
          spriteReady = true;
        };
        img.onerror = () => {
          spriteFailed = true;
        };
        img.src = url;
      });
    }

    const sortedLowSources = [...sources].sort((a, b) => a.size - b.size);
    const lowestMp4Url = sortedLowSources.length ? sortedLowSources[0].src : "";
    let fallbackVideoLoaded = false;
    let fallbackVideoPrimed = false;
    let isMiniVideoSeeking = false;
    let seekStartedAt = 0;
    let pendingMiniVideoSec = null;
    let isSeekbarScrubbing = false;

    function ensureFallbackVideo() {
      if (fallbackVideoLoaded || !lowestMp4Url) return;
      fallbackVideoLoaded = true;
      miniPreviewVideo.src = lowestMp4Url;
      miniPreviewVideo.load();
    }

    function flushMiniVideoSeek() {
      if (isMiniVideoSeeking && Date.now() - seekStartedAt > 4500) {
        isMiniVideoSeeking = false;
      }
      if (isMiniVideoSeeking || pendingMiniVideoSec === null) return;
      if (miniPreviewVideo.readyState < 1) return;

      const nextSec = pendingMiniVideoSec;
      pendingMiniVideoSec = null;
      if (Math.abs((miniPreviewVideo.currentTime || 0) - nextSec) < 0.25) return;

      isMiniVideoSeeking = true;
      seekStartedAt = Date.now();
      try {
        miniPreviewVideo.currentTime = nextSec;
      } catch (err) {
        isMiniVideoSeeking = false;
      }
    }

    miniPreviewVideo.addEventListener("loadedmetadata", flushMiniVideoSeek);
    miniPreviewVideo.addEventListener("loadeddata", () => {
      if (!fallbackVideoPrimed) {
        fallbackVideoPrimed = true;
        try {
          const p = miniPreviewVideo.play();
          if (p && typeof p.then === "function") {
            p.then(() => {
              miniPreviewVideo.pause();
              flushMiniVideoSeek();
            }).catch(() => flushMiniVideoSeek());
          } else {
            flushMiniVideoSeek();
          }
        } catch (err) {
          flushMiniVideoSeek();
        }
      } else {
        flushMiniVideoSeek();
      }
    });
    miniPreviewVideo.addEventListener("seeked", () => {
      isMiniVideoSeeking = false;
      flushMiniVideoSeek();
    });
    miniPreviewVideo.addEventListener("error", () => {
      isMiniVideoSeeking = false;
    });

    function getTotalDuration() {
      if (player.duration && isFinite(player.duration) && player.duration > 1) {
        return player.duration;
      }
      const m = player.media || videoEl;
      if (m.duration && isFinite(m.duration) && m.duration > 1) {
        return m.duration;
      }
      return vttCues.length ? vttCues[vttCues.length - 1].end : 0;
    }

    function renderMiniPreviewAtRatio(ratio) {
      if (isLocked) return;
      const totalDur = getTotalDuration();
      if (!totalDur || isNaN(totalDur)) return;

      ratio = Math.max(0, Math.min(1, ratio));
      const targetSec = ratio * totalDur;

      const cRect = container.getBoundingClientRect();
      const progressEl = player.elements.progress;
      const pRect = progressEl ? progressEl.getBoundingClientRect() : null;
      if (!cRect.width) return;

      miniPreviewTime.textContent = formatPreviewTime(targetSec) + " / " + formatPreviewTime(totalDur);

      let activeCue = null;
      if (vttCues.length > 0 && !spriteFailed) {
        for (let i = 0; i < vttCues.length; i++) {
          if (targetSec >= vttCues[i].start && targetSec <= vttCues[i].end) {
            activeCue = vttCues[i];
            break;
          }
        }
        if (!activeCue) {
          activeCue = vttCues[Math.min(vttCues.length - 1, Math.max(0, Math.floor(ratio * vttCues.length)))];
        }
      }

      if (activeCue && spriteReady && spriteCache[activeCue.url]) {
        miniPreviewVideo.style.display = "none";
        miniPreviewSprite.style.display = "block";
        const imgDim = spriteCache[activeCue.url];
        const targetW = Math.round((cRect.width < 420 ? 140 : 168) * uiScale());

        if (activeCue.w > 0 && activeCue.h > 0) {
          const scale = targetW / activeCue.w;
          miniPreviewFrame.style.width = targetW + "px";
          miniPreviewFrame.style.height = Math.round(activeCue.h * scale) + "px";
          miniPreviewSprite.style.backgroundImage = 'url("' + activeCue.url + '")';
          miniPreviewSprite.style.backgroundSize = (imgDim.w * scale) + "px " + (imgDim.h * scale) + "px";
          miniPreviewSprite.style.backgroundPosition = (-activeCue.x * scale) + "px " + (-activeCue.y * scale) + "px";
        } else {
          miniPreviewFrame.style.width = targetW + "px";
          miniPreviewFrame.style.height = Math.round(targetW * (imgDim.h / imgDim.w || 0.5625)) + "px";
          miniPreviewSprite.style.backgroundImage = 'url("' + activeCue.url + '")';
          miniPreviewSprite.style.backgroundSize = "cover";
          miniPreviewSprite.style.backgroundPosition = "center";
        }
      } else if (lowestMp4Url) {
        ensureFallbackVideo();
        miniPreviewSprite.style.display = "none";
        miniPreviewVideo.style.display = "block";

        const m = player.media || videoEl;
        const vw = miniPreviewVideo.videoWidth || m.videoWidth || 16;
        const vh = miniPreviewVideo.videoHeight || m.videoHeight || 9;
        const aspect = vh / vw;
        const boxW = Math.round((aspect > 1.1 ? 96 : (cRect.width < 420 ? 144 : 168)) * uiScale());
        miniPreviewFrame.style.width = boxW + "px";
        miniPreviewFrame.style.height = Math.round(boxW * aspect) + "px";

        pendingMiniVideoSec = targetSec;
        flushMiniVideoSeek();
      }

      const frameW = miniPreviewFrame.offsetWidth || 160;
      const halfW = frameW / 2 + 12;
      const trackLeft = pRect && pRect.width > 0 ? pRect.left : cRect.left;
      const trackWidth = pRect && pRect.width > 0 ? pRect.width : cRect.width;
      const rawX = (trackLeft + ratio * trackWidth) - cRect.left;
      const clampedX = Math.max(halfW, Math.min(cRect.width - halfW, rawX));
      const bottomPx = pRect && pRect.top > 0
        ? Math.max(58, cRect.bottom - pRect.top + 14)
        : 66;

      miniPreview.style.left = clampedX + "px";
      miniPreview.style.bottom = bottomPx + "px";
      miniPreview.classList.add("show");
    }

    function updateMiniPreview(clientX) {
      const progressEl = player.elements.progress;
      if (!progressEl) return;
      const pRect = progressEl.getBoundingClientRect();
      if (!pRect.width) return;
      const ratio = Math.max(0, Math.min(1, (clientX - pRect.left) / pRect.width));
      renderMiniPreviewAtRatio(ratio);
    }

    function hideMiniPreview() {
      hideScrubDelta();
      isSeekbarScrubbing = false;
      pendingMiniVideoSec = null;
      miniPreview.classList.remove("show");
    }

    const progressEl = player.elements.progress;
    const seekInput = progressEl ? progressEl.querySelector('input[data-plyr="seek"]') : null;

    function syncSeekInputVisual(ratio) {
      if (!seekInput) return;
      const clamped = Math.max(0, Math.min(1, ratio));
      const maxVal = parseFloat(seekInput.max) || 100;
      seekInput.value = (clamped * maxVal).toFixed(3);
      seekInput.style.setProperty("--value", (clamped * 100).toFixed(2) + "%");
    }

    if (progressEl) {
      progressEl.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches[0]) {
          isSeekbarScrubbing = true;
          updateMiniPreview(e.touches[0].clientX);
        }
      }, { passive: true });

      progressEl.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0]) {
          isSeekbarScrubbing = true;
          updateMiniPreview(e.touches[0].clientX);
        }
      }, { passive: true });

      progressEl.addEventListener("touchend", hideMiniPreview, { passive: true });
      progressEl.addEventListener("touchcancel", hideMiniPreview, { passive: true });

      progressEl.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse") {
          isSeekbarScrubbing = true;
          updateMiniPreview(e.clientX);
        }
      }, { passive: true });

      progressEl.addEventListener("pointermove", (e) => {
        if (e.pointerType === "mouse" || isSeekbarScrubbing) {
          updateMiniPreview(e.clientX);
        }
      }, { passive: true });

      progressEl.addEventListener("pointerup", (e) => {
        if (e.pointerType !== "mouse") hideMiniPreview();
      }, { passive: true });

      progressEl.addEventListener("pointercancel", hideMiniPreview, { passive: true });
      progressEl.addEventListener("mouseleave", hideMiniPreview, { passive: true });

      if (seekInput) {
        seekInput.addEventListener("input", () => {
          const maxVal = parseFloat(seekInput.max) || 100;
          const pct = Math.max(0, Math.min(1, (parseFloat(seekInput.value) || 0) / maxVal));
          renderMiniPreviewAtRatio(pct);
          const dur = getTotalDuration();
          if (dur > 0) showScrubDelta(pct * dur, scrubOrigin);
        });
        seekInput.addEventListener("change", () => {
          hideScrubDelta();
          if (isSeekbarScrubbing) hideMiniPreview();
        });
        // remember where the drag started (before Plyr moves the video)
        progressEl.addEventListener("pointerdown", () => { scrubOrigin = (player.media || videoEl).currentTime || 0; }, { capture: true, passive: true });
        progressEl.addEventListener("touchstart", () => { if (scrubOrigin === null) scrubOrigin = (player.media || videoEl).currentTime || 0; }, { capture: true, passive: true });
      }
    }

    // Auto-lock to landscape on entering fullscreen & unlock on exit
    player.on("enterfullscreen", () => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(() => {});
      }
    });

    player.on("exitfullscreen", () => {
      if (screen.orientation && screen.orientation.unlock) {
        try { screen.orientation.unlock(); } catch (e) {}
      }
    });

    // 2. Resume Playback (Save & Restore Timestamp)
    const resumeKey = "resume_" + videoId;
    videoEl.addEventListener("loadedmetadata", () => {
      if (qualitySwitchToken > 0) return;
      const savedTime = parseFloat(localStorage.getItem(resumeKey));
      if (savedTime && savedTime > 3 && savedTime < videoEl.duration - 5) {
        videoEl.currentTime = savedTime;
      }
    }, { once: true });

    let lastSave = 0;
    videoEl.addEventListener("timeupdate", () => {
      const now = Date.now();
      if (now - lastSave > 3000 && videoEl.currentTime > 0) {
        localStorage.setItem(resumeKey, videoEl.currentTime);
        lastSave = now;
      }
    });
    videoEl.addEventListener("pause", () => {
      if (videoEl.currentTime > 0) localStorage.setItem(resumeKey, videoEl.currentTime);
    });

    // 3. Web Audio API for 300% Volume Boost
    let audioCtx = null;
    let gainNode = null;
    function initAudioBoost() {
      if (audioCtx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(player.media || videoEl);
        gainNode = audioCtx.createGain();
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
      } catch (e) {
        audioCtx = null;
      }
    }

    // 4. Gesture State Machine (3 Vertical Zones + Bottom 30% Extended Seekbar + Pinch-to-Fill)
    const hudIcon = document.getElementById("hudIcon");
    const hudText = document.getElementById("hudText");

    let isLocked = false;
    // "none" | "volume" | "brightness" | "fullscreen" | "speed" | "seek" | "pinch" | "ignored"
    let gestureMode = "none";
    let wasGesture = false;
    let pendingFullscreenAction = null; // "enter" | "exit" | null
    let startX = 0, startY = 0;
    let holdTimer = null, hudTimer = null;

    let originalSpeed = 1.0;
    let currentVolumePct = 100, startVolumePct = 100;
    let currentBrightnessPct = 100, startBrightnessPct = 100;
    let initialPinchDist = null;

    let seekStartTime = 0;
    let pendingSeekTime = null;
    let seekTrackWidth = 300;

    const ICONS = {
      speed: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      volume: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',
      brightness: '<span class="material-symbols-outlined">brightness_6</span>',
      brightnessHigh: '<span class="material-symbols-outlined">light_mode</span>',
      zoom: '<span class="material-symbols-outlined">expand_content</span>',
      fullscreen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>',
      exitFullscreen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>'
    };

    function showHud(type, text) {
      hudIcon.innerHTML = ICONS[type];
      hudText.textContent = text;
      gestureHud.classList.add("show");
      clearTimeout(hudTimer);
    }

    function hideHud(delay = 600) {
      clearTimeout(hudTimer);
      hudTimer = setTimeout(() => gestureHud.classList.remove("show"), delay);
    }

    function applyFullscreenAction() {
      const action = pendingFullscreenAction;
      pendingFullscreenAction = null;
      if (action === "enter" && !player.fullscreen.active) {
        try { player.fullscreen.enter(); } catch (e) {}
      } else if (action === "exit" && player.fullscreen.active) {
        try { player.fullscreen.exit(); } catch (e) {}
      }
    }

    // Pinch-to-Fill (2-finger touch)
    container.addEventListener("touchstart", (e) => {
      if (isLocked) return;
      if (e.touches.length === 2) {
        clearTimeout(holdTimer);
        holdTimer = null;
        gestureMode = "pinch";
        pendingFullscreenAction = null;
        pendingSeekTime = null;
        hideMiniPreview();
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
      if (isLocked || e.touches.length !== 2 || initialPinchDist === null) return;
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (currentDist - initialPinchDist > 35) {
        container.classList.add("is-filled");
        showHud("zoom", "Fill Screen");
      } else if (initialPinchDist - currentDist > 35) {
        container.classList.remove("is-filled");
        showHud("zoom", "Fit Screen");
      }
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
      if (e.touches.length < 2 && gestureMode === "pinch") {
        initialPinchDist = null;
        gestureMode = "none";
        hideHud(600);
      }
    });

    function isInteractiveControlTarget(target) {
      return Boolean(
        target.closest(".plyr__controls") ||
        target.closest(".plyr__menu__container") ||
        target.closest(".plyr__control--overlaid") ||
        target.closest(".q-menu") ||
        target.closest(".s-menu") ||
        target.closest(".top-toolbar")
      );
    }

    // Picture-in-Picture: show the thumbnail instead of a black screen.
    // The <video> element itself is never touched, so volume and mute stay exactly as they are.
    const pipPoster = document.createElement("div");
    pipPoster.className = "pip-poster";
    pipPoster.id = "pipPoster";
    const pipPosterUrl = (C.poster || "");
    if (pipPosterUrl) pipPoster.style.backgroundImage = "url(" + JSON.stringify(pipPosterUrl) + ")";
    container.appendChild(pipPoster);

    function syncVolumeState() {
      // Keep the gesture's volume % and the mute icon in step with the real player state
      let v = 1;
      try { v = Number(player.volume); } catch (e) {}
      if (gestureMode !== "volume") {
        const boosted = (gainNode && gainNode.gain.value > 1 && v >= 1) ? Math.round(gainNode.gain.value * 100) : 0;
        currentVolumePct = boosted || Math.round(v * 100);
      }
      updateVolumeIcon();
    }

    // Once the video has played, pausing must show the paused frame, never the thumbnail
    function markStarted() {
      if (container.classList.contains("has-started")) return;
      const m = player.media || videoEl;
      if (!m.paused || (m.currentTime || 0) > 0) container.classList.add("has-started");
    }
    videoEl.addEventListener("playing", markStarted);
    videoEl.addEventListener("timeupdate", markStarted);
    videoEl.addEventListener("pause", markStarted);
    videoEl.addEventListener("seeked", markStarted);

    let pipActive = false;
    function updatePipPoster() {
      // Thumbnail only while the video is actually playing in PiP; when paused, nothing is drawn
      const m = player.media || videoEl;
      container.classList.toggle("is-pip-shown", pipActive && !m.paused && !m.ended);
    }
    function setPipState(on) {
      pipActive = on;
      container.classList.toggle("is-pip", on);
      if (on) hideSettings();
      updatePipPoster();
      syncVolumeState();
    }
    videoEl.addEventListener("play", updatePipPoster);
    videoEl.addEventListener("playing", updatePipPoster);
    videoEl.addEventListener("pause", updatePipPoster);
    videoEl.addEventListener("ended", updatePipPoster);
    videoEl.addEventListener("enterpictureinpicture", () => setPipState(true));
    videoEl.addEventListener("leavepictureinpicture", () => setPipState(false));
    videoEl.addEventListener("webkitpresentationmodechanged", () => {
      setPipState(videoEl.webkitPresentationMode === "picture-in-picture");
    });
    player.on("volumechange", syncVolumeState);

    // Single-finger / Mouse Gestures
    container.addEventListener("pointerdown", (e) => {
      if (isLocked || gestureMode === "pinch" || isInteractiveControlTarget(e.target)) return;
      if (e.button !== 0 && e.pointerType === "mouse") return;

      startX = e.clientX;
      startY = e.clientY;
      startVolumePct = currentVolumePct;
      startBrightnessPct = currentBrightnessPct;
      gestureMode = "none";
      pendingFullscreenAction = null;
      pendingSeekTime = null;
      wasGesture = false;

      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        holdTimer = null;
        if (isLocked || gestureMode !== "none") return;
        gestureMode = "speed";
        originalSpeed = player.speed || 1.0;
        player.speed = 2.0;
        showHud("speed", "2.0x");
      }, 350);
    });

    container.addEventListener("pointermove", (e) => {
      if (isLocked || gestureMode === "pinch" || gestureMode === "ignored" || (!holdTimer && gestureMode === "none")) return;
      const deltaX = e.clientX - startX;
      const deltaY = startY - e.clientY; // positive = UP, negative = DOWN

      if (gestureMode === "speed") {
        let newSpeed = 2.0 + (deltaY / 18) * 0.1;
        newSpeed = Math.max(0.25, Math.min(4.0, Math.round(newSpeed * 10) / 10));
        player.speed = newSpeed;
        showHud("speed", newSpeed.toFixed(1) + "x");
        return;
      }

      if (gestureMode === "none") {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        if (Math.max(absX, absY) > 12) {
          clearTimeout(holdTimer);
          holdTimer = null;

          const rect = container.getBoundingClientRect();
          const relX = (startX - rect.left) / rect.width;
          const relY = (startY - rect.top) / rect.height;

          // Horizontal swipe in bottom 30% zone => Extended Seekbar Scrubbing
          if (absX > absY) {
            if (relY >= 0.70 && getTotalDuration() > 0) {
              gestureMode = "seek";
              seekStartTime = player.currentTime || (player.media || videoEl).currentTime || 0;
              pendingSeekTime = seekStartTime;
              const pRect = progressEl ? progressEl.getBoundingClientRect() : null;
              seekTrackWidth = (pRect && pRect.width > 40) ? pRect.width : Math.max(200, rect.width);
              container.classList.remove("plyr--hide-controls");
            } else {
              gestureMode = "ignored";
              return;
            }
          } else {
            // Vertical swipe => 3-column Volume / Fullscreen / Brightness
            if (relX < 0.30) {
              gestureMode = "volume";
            } else if (relX > 0.70) {
              gestureMode = "brightness";
            } else {
              gestureMode = "fullscreen";
            }
          }
        }
      }

      if (gestureMode === "seek") {
        const totalDur = getTotalDuration();
        if (totalDur > 0) {
          const deltaTime = (deltaX / seekTrackWidth) * totalDur;
          pendingSeekTime = Math.max(0, Math.min(totalDur, seekStartTime + deltaTime));
          const ratio = pendingSeekTime / totalDur;
          syncSeekInputVisual(ratio);
          renderMiniPreviewAtRatio(ratio);
          showScrubDelta(pendingSeekTime, seekStartTime);
        }
      } else if (gestureMode === "volume") {
        currentVolumePct = Math.max(0, Math.min(300, Math.round(startVolumePct + deltaY * 1.2)));
        player.volume = Math.min(1, currentVolumePct / 100);
        if (currentVolumePct > 100) {
          initAudioBoost();
          if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
          if (gainNode) gainNode.gain.value = currentVolumePct / 100;
        } else if (gainNode) {
          gainNode.gain.value = 1.0;
        }
        showHud("volume", "Volume: " + currentVolumePct + "%");
      } else if (gestureMode === "brightness") {
        currentBrightnessPct = Math.max(20, Math.min(150, Math.round(startBrightnessPct + deltaY * 0.6)));
        if (currentBrightnessPct <= 100) {
          brightnessOverlay.style.background = "#000";
          brightnessOverlay.style.opacity = ((100 - currentBrightnessPct) / 100).toFixed(2);
        } else {
          brightnessOverlay.style.background = "#fff";
          brightnessOverlay.style.opacity = ((currentBrightnessPct - 100) / 200).toFixed(2);
        }
        showHud(currentBrightnessPct > 100 ? "brightnessHigh" : "brightness", "Brightness: " + currentBrightnessPct + "%");
      } else if (gestureMode === "fullscreen") {
        if (!player.fullscreen.active && deltaY > 45) {
          pendingFullscreenAction = "enter";
          showHud("fullscreen", "Fullscreen Landscape");
        } else if (player.fullscreen.active && deltaY < -45) {
          pendingFullscreenAction = "exit";
          showHud("exitFullscreen", "Exit Fullscreen");
        } else {
          pendingFullscreenAction = null;
          gestureHud.classList.remove("show");
        }
      }
    });

    function endGesture(e, isCancel = false) {
      clearTimeout(holdTimer);
      holdTimer = null;
      if (gestureMode !== "none" && gestureMode !== "pinch") {
        wasGesture = true;
        setTimeout(() => { wasGesture = false; }, 320);
      }
      if (gestureMode === "speed") {
        player.speed = originalSpeed;
        hideHud(300);
      } else if (gestureMode === "seek") {
        if (!isCancel && pendingSeekTime !== null && !isNaN(pendingSeekTime)) {
          player.currentTime = pendingSeekTime;
          localStorage.setItem(resumeKey, pendingSeekTime);
          player.play().catch(() => {});
        }
        pendingSeekTime = null;
        hideMiniPreview();
      } else if (gestureMode === "fullscreen") {
        if (!e || e.pointerType !== "mouse") {
          applyFullscreenAction();
        }
        hideHud(450);
      } else if (gestureMode !== "none" && gestureMode !== "pinch" && gestureMode !== "ignored") {
        hideHud(600);
      }
      if (gestureMode !== "pinch") gestureMode = "none";
    }

    window.addEventListener("pointerup", (e) => {
      // Fix: a quick tap must cancel the pending 2x hold timer
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      if (gestureMode !== "none" && gestureMode !== "pinch") endGesture(e, false);
    });
    window.addEventListener("pointercancel", (e) => {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      if (gestureMode !== "none" && gestureMode !== "pinch") {
        pendingFullscreenAction = null;
        endGesture(e, true);
      }
    });
    container.addEventListener("mouseup", () => {
      if (pendingFullscreenAction) applyFullscreenAction();
    });

    // 5. YouTube-Style Accumulating Seek (10, 20, 30...) & Flicker-Free Tap
    let rewindCount = 0, forwardCount = 0;
    let rewindResetTimer = null, forwardResetTimer = null;
    let activeSeekSide = null; // "left" | "right" | null

    function resetSeekSide(side) {
      if (side === "left") {
        clearTimeout(rewindResetTimer);
        rewindAnim.classList.remove("show");
        rewindCount = 0;
        if (activeSeekSide === "left") activeSeekSide = null;
      } else if (side === "right") {
        clearTimeout(forwardResetTimer);
        forwardAnim.classList.remove("show");
        forwardCount = 0;
        if (activeSeekSide === "right") activeSeekSide = null;
      }
    }

    function triggerSeekAnim(isForward) {
      const el = isForward ? forwardAnim : rewindAnim;
      const textSpan = el.querySelector("span:not(.material-symbols-outlined)");

      if (isForward) {
        if (activeSeekSide === "left") resetSeekSide("left");
        activeSeekSide = "right";
        forwardCount += 10;
        textSpan.textContent = forwardCount > 10 ? forwardCount + "s" : "";
        clearTimeout(forwardResetTimer);
        forwardResetTimer = setTimeout(() => resetSeekSide("right"), 900);
      } else {
        if (activeSeekSide === "right") resetSeekSide("right");
        activeSeekSide = "left";
        rewindCount += 10;
        textSpan.textContent = rewindCount > 10 ? rewindCount + "s" : "";
        clearTimeout(rewindResetTimer);
        rewindResetTimer = setTimeout(() => resetSeekSide("left"), 900);
      }

      el.classList.add("show");
    }

    container.addEventListener("dblclick", (e) => {
      if (isLocked || isInteractiveControlTarget(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    }, true);

    let lastTap = 0, lastTapSide = null, singleTapTimer = null;
    container.addEventListener("click", (e) => {
      if (isLocked) return;

      if (wasGesture) {
        wasGesture = false;
        return;
      }

      const ctrlBtn = e.target.closest(".plyr__controls button");
      if (ctrlBtn) {
        const action = ctrlBtn.getAttribute("data-plyr");
        if (action === "rewind") triggerSeekAnim(false);
        if (action === "fast-forward") triggerSeekAnim(true);
        return;
      }

      if (isInteractiveControlTarget(e.target)) return;

      const rect = container.getBoundingClientRect();
      const isRightSide = (e.clientX - rect.left) >= (rect.width / 2);
      const clickedSide = isRightSide ? "right" : "left";
      const now = Date.now();

      if (activeSeekSide === clickedSide) {
        clearTimeout(singleTapTimer);
        if (isRightSide) {
          player.forward(10);
          triggerSeekAnim(true);
        } else {
          player.rewind(10);
          triggerSeekAnim(false);
        }
        lastTap = now;
        lastTapSide = clickedSide;
        return;
      }

      if (now - lastTap < 280 && lastTapSide === clickedSide) {
        clearTimeout(singleTapTimer);
        if (isRightSide) {
          player.forward(10);
          triggerSeekAnim(true);
        } else {
          player.rewind(10);
          triggerSeekAnim(false);
        }
      } else {
        singleTapTimer = setTimeout(() => {
          player.togglePlay();
        }, 280);
      }
      lastTap = now;
      lastTapSide = clickedSide;
    });

    document.addEventListener("keydown", (e) => {
      if (isLocked) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === "ArrowLeft") triggerSeekAnim(false);
      if (e.key === "ArrowRight") triggerSeekAnim(true);
    }, true);

    // 6. Auto-Hide Screen Lock & Color Picker
    const lockBtn = document.getElementById("lockBtn");
    const lockIcon = document.getElementById("lockIcon");
    let lockHideTimer = null;

    function scheduleLockHide() {
      clearTimeout(lockHideTimer);
      lockBtn.classList.remove("lock-hidden");
      if (isLocked) {
        lockHideTimer = setTimeout(() => lockBtn.classList.add("lock-hidden"), 2000);
      }
    }

    lockBtn.addEventListener("click", () => {
      isLocked = !isLocked;
      container.classList.toggle("is-locked", isLocked);
      lockShield.classList.toggle("active", isLocked);
      if (isLocked) { hideMiniPreview(); hideSettings(); }
      lockIcon.innerHTML = isLocked
        ? '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>'
        : '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>';
      scheduleLockHide();
    });

    lockShield.addEventListener("click", () => {
      if (isLocked) scheduleLockHide();
    });

    const colorPicker = document.getElementById("barColorPicker");
    const colorReset = document.getElementById("barColorReset");
    const BASE_COLOR = (C.color || null);   // ?color= from the URL (null = SVG palette)
    const SVG_MAIN = SVG_MAIN_COLOR;
    const COLOR_VARS = ["--plyr-color-main", "--bar-grad", "--ld-c1", "--ld-c2", "--ld-c3", "--ld-c4", "--ld-c5"];

    // color given => seekbar + loader use exactly that color; null => back to the default palette
    function applyBarColor(color) {
      const rs = document.documentElement.style;
      if (color) {
        rs.setProperty("--plyr-color-main", color);
        rs.setProperty("--bar-grad", "linear-gradient(to right, " + color + ", " + color + ")");
        for (let i = 1; i <= 5; i++) rs.setProperty("--ld-c" + i, color);
        colorPicker.value = color;
      } else {
        COLOR_VARS.forEach((v) => rs.removeProperty(v));
        colorPicker.value = BASE_COLOR || SVG_MAIN;
      }
      document.documentElement.classList.toggle("has-color-override", !!color);
    }

    let savedColor = null;
    try { savedColor = localStorage.getItem("plyrBarColor"); } catch (e) {}
    if (savedColor && /^#[0-9a-f]{6}$/i.test(savedColor) && !BASE_COLOR) {
      applyBarColor(savedColor);
    } else {
      colorPicker.value = BASE_COLOR || SVG_MAIN;
    }

    colorPicker.addEventListener("input", (e) => {
      const newColor = e.target.value;
      applyBarColor(newColor);
      try { localStorage.setItem("plyrBarColor", newColor); } catch (err) {}
    });

    colorReset.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      try { localStorage.removeItem("plyrBarColor"); } catch (err) {}
      applyBarColor(null);
    });
}
})();
