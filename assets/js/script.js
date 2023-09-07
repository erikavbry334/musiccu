import musics from "../music/music.js";

const current = localStorage.getItem("current") || 0;

const musicPlayer = document.querySelector(".music-player");
let currentSong = musics[current];
musicPlayer.querySelector("img").src = currentSong.thumbnail;
musicPlayer.querySelector("h1").innerText = currentSong.judul;
musicPlayer.querySelector("h6").innerText = currentSong.penyanyi;
musicPlayer.querySelector("audio").src = currentSong.audio;
document.body.style.backgroundImage = `url('${currentSong.thumbnail}')`;

musicPlayer.querySelector(".music-play").addEventListener("click", () => {
  if (musicPlayer.querySelector("audio").paused) {
    play();
  } else {
    pause();
  }
});

function getMusicDuration(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.src = url;
  });
}

const list = document.querySelector(".music-list .card-body");
musics.forEach(async (music, index) => {
  const duration = await getMusicDuration(music.audio);
  let minutes = Math.floor(duration / 60);
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  let seconds = Math.floor(duration % 60);
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  list.innerHTML += `
    <div class="music-item">
      <img src="${music.thumbnail}">
      <div class="music-info">
          <h6 class="mb-0">${music.judul}</h6>
          <p class="mb-0">${music.penyanyi}</p>
      </div>
      <span class="ms-auto me-4">${minutes}:${seconds}</span>
      <button type="button" class="btn play" data-index="${index}">
          <i class="fas fa-play"></i>
      </button>
    </div>
  `;
});

list.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("play") ||
    e.target.parentElement.classList.contains("play")
  ) {
    const index =
      e.target.dataset.index || e.target.parentElement.dataset.index;
    localStorage.setItem("current", index);

    currentSong = musics[index];
    musicPlayer.querySelector("img").src = currentSong.thumbnail;
    musicPlayer.querySelector("h1").innerText = currentSong.judul;
    musicPlayer.querySelector("h6").innerText = currentSong.penyanyi;
    musicPlayer.querySelector("audio").src = currentSong.audio;
    document.body.style.backgroundImage = `url('${currentSong.thumbnail}')`;

    play();
  }
});

let intervalProgres = null;

function play() {
  musicPlayer.querySelector(".music-play i").classList.remove("fa-play");
  musicPlayer.querySelector(".music-play i").classList.add("fa-pause");
  musicPlayer.querySelector("audio").play();

  intervalProgres = setInterval(trackProgress, 100);
}

function pause() {
  musicPlayer.querySelector(".music-play i").classList.remove("fa-pause");
  musicPlayer.querySelector(".music-play i").classList.add("fa-play");
  musicPlayer.querySelector("audio").pause();

  clearInterval(intervalProgres);
}

function trackProgress() {
  const progress =
    (musicPlayer.querySelector("audio").currentTime /
      musicPlayer.querySelector("audio").duration) *
    100;

  musicPlayer.querySelector(
    ".music-track-indicator"
  ).style.left = `${progress}%`;
  musicPlayer.querySelector(
    ".music-track-progress"
  ).style.width = `${progress}%`;
}

musicPlayer.querySelector(".music-track").addEventListener("click", (e) => {
  const progress =
    (e.offsetX / musicPlayer.querySelector(".music-track").clientWidth) * 100;

  musicPlayer.querySelector(
    ".music-track-indicator"
  ).style.left = `${progress}%`;
  musicPlayer.querySelector(
    ".music-track-progress"
  ).style.width = `${progress}%`;

  musicPlayer.querySelector("audio").currentTime =
    (musicPlayer.querySelector("audio").duration / 100) * progress;
});

musicPlayer.querySelector(".music-prev").addEventListener("click", () => {
  let index = parseInt(localStorage.getItem("current")) - 1;
  if (index < 0) {
    index = musics.length - 1;
  }

  localStorage.setItem("current", index);

  currentSong = musics[index];
  musicPlayer.querySelector("img").src = currentSong.thumbnail;
  musicPlayer.querySelector("h1").innerText = currentSong.judul;
  musicPlayer.querySelector("h6").innerText = currentSong.penyanyi;
  musicPlayer.querySelector("audio").src = currentSong.audio;
  document.body.style.backgroundImage = `url('${currentSong.thumbnail}')`;

  play();
});

musicPlayer.querySelector(".music-next").addEventListener("click", () => {
  let index = parseInt(localStorage.getItem("current")) + 1;
  if (index >= musics.length) {
    index = 0;
  }

  localStorage.setItem("current", index);

  currentSong = musics[index];
  musicPlayer.querySelector("img").src = currentSong.thumbnail;
  musicPlayer.querySelector("h1").innerText = currentSong.judul;
  musicPlayer.querySelector("h6").innerText = currentSong.penyanyi;
  musicPlayer.querySelector("audio").src = currentSong.audio;
  document.body.style.backgroundImage = `url('${currentSong.thumbnail}')`;

  play();
});

musicPlayer.querySelector("audio").addEventListener("ended", () => {
  let index = parseInt(localStorage.getItem("current")) + 1;
  if (index >= musics.length) {
    index = 0;
  }

  localStorage.setItem("current", index);

  currentSong = musics[index];
  musicPlayer.querySelector("img").src = currentSong.thumbnail;
  musicPlayer.querySelector("h1").innerText = currentSong.judul;
  musicPlayer.querySelector("h6").innerText = currentSong.penyanyi;
  musicPlayer.querySelector("audio").src = currentSong.audio;
  document.body.style.backgroundImage = `url('${currentSong.thumbnail}')`;

  play();
});
