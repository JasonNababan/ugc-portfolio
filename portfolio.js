const clips = [
  { platform: "tiktok", id: "7542367427930213653", count: 106512, title: "The part-time job trap in Taiwan", format: "Student life · Talking head", cover: "PART-TIME TRAP", color: "lime", pinned: true, image: "tt-parttime.jpg" },
  { platform: "instagram", id: "DZdC4ClyV11", count: 21607, title: "Productive ways to avoid studying", format: "Campus humor · Personal Reel", cover: "STUDY BREAK", color: "pink", image: "ig-study.jpg" },
  { platform: "instagram", id: "DaH9zPdBgEj", count: 6774, title: "The startup story nobody shows", format: "Behind the scenes · Cultivator collab", cover: "BEHIND THE BUILD", color: "blue", image: "ig-build.jpg" },
  { platform: "tiktok", id: "7534727371987963143", count: 5208, title: "What studying abroad in Taiwan felt like", format: "Student life · Storytime", cover: "TAIWAN DIARIES", color: "lavender", image: "tt-taiwan.jpg" },
  { platform: "instagram", id: "DaNNYqZTT9b", count: 5123, title: "Starting a startup is so easy", format: "Founder humor · Cultivator collab", cover: "STARTUP LIFE", color: "peach", image: "ig-startup.jpg" },
  { platform: "tiktok", id: "7626659803707985173", count: 4814, title: "When the class is fun and you’re lost", format: "Campus humor · Short-form", cover: "CLASS IN SESSION", color: "pink", image: "tt-class.jpg" },
  { platform: "tiktok", id: "7535330152918617362", count: 3860, title: "Learning Mandarin in Taiwan", format: "Study abroad · Talking head", cover: "OUTSIDE MY BUBBLE", color: "blue", image: "tt-mandarin.jpg" },
  { platform: "instagram", id: "DaFloTChKFo", count: 3682, title: "Four people, four cities, one startup", format: "Founder diary · Cultivator collab", cover: "BUILD IN PUBLIC", color: "lime", image: "ig-four.jpg" },
];

const grid = document.querySelector("#video-grid");
const dialog = document.querySelector("#player");
const player = document.querySelector("#player-window");
const source = document.querySelector("#source-link");
const filters = [...document.querySelectorAll("[data-filter]")];
const exact = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

for (const [index, clip] of clips.entries()) {
  const tiktok = clip.platform === "tiktok";
  const platformName = tiktok ? "TikTok" : "Instagram";
  const unit = tiktok ? "views" : "plays";
  clip.url = tiktok ? `https://www.tiktok.com/@jasonnabbb/video/${clip.id}` : `https://www.instagram.com/p/${clip.id}/`;
  const link = document.createElement("a");
  link.className = "video-card";
  link.href = clip.url;
  link.dataset.video = index;
  link.dataset.platform = clip.platform;
  link.setAttribute("aria-label", `Watch ${clip.title}. ${exact.format(clip.count)} ${platformName} ${unit}.`);
  link.innerHTML = `
    <div class="tile tile-${clip.color}" aria-hidden="true">
      <div class="tile-meta"><span class="platform">${platformName}</span>${clip.pinned ? '<span class="platform pin">Pinned</span>' : ''}</div>
      <span class="tile-word">${clip.cover}</span>
      <span class="tap-play">▶</span>
    </div>
    <div class="video-text">
      <strong class="clip-count" title="${exact.format(clip.count)} ${unit}">${compact.format(clip.count)}</strong>
      <span class="clip-unit">${unit.toUpperCase()}</span>
      <h3>${clip.title}</h3>
      <span class="clip-format">${clip.format}</span>
    </div>`;
  grid.append(link);
  if (clip.image) {
    const image = new Image();
    image.alt = "";
    image.decoding = "async";
    image.className = "tile-image";
    image.addEventListener("load", () => link.querySelector(".tile").classList.add("tile-photo"), { once: true });
    image.src = `./${clip.image}`;
    link.querySelector(".tile").prepend(image);
  }
}

for (const filter of filters) {
  filter.addEventListener("click", () => {
    const platform = filter.dataset.filter;
    for (const button of filters) button.setAttribute("aria-pressed", String(button === filter));
    for (const card of grid.children) card.hidden = platform !== "all" && card.dataset.platform !== platform;
  });
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("a[data-video]");
  if (!trigger || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== "function") return;
  const clip = clips[Number(trigger.dataset.video)];
  if (!clip) return;
  event.preventDefault();
  const tiktok = clip.platform === "tiktok";
  const platform = tiktok ? "TikTok" : "Instagram";
  document.querySelector("#player-title").textContent = clip.title;
  document.querySelector("#player-metric").textContent = `${exact.format(clip.count)} ${tiktok ? "VIEWS" : "PLAYS"} · ${platform.toUpperCase()}`;
  source.href = clip.url;
  source.textContent = `Open original on ${platform} ↗`;
  const iframe = document.createElement("iframe");
  iframe.title = `${platform} video: ${clip.title}`;
  iframe.src = tiktok ? `https://www.tiktok.com/player/v1/${clip.id}?autoplay=0&description=0&music_info=0` : `${clip.url}embed/`;
  iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;
  player.replaceChildren(iframe);
  dialog.showModal();
});

dialog.addEventListener("close", () => player.replaceChildren());
