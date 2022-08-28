const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const totalTime = document.querySelector("#totalTime");
const currenTime = document.querySelector("#currenTime");
const volumnRange = document.querySelector("#volumn");
const timeLine = document.querySelector("#timeline");
const fullScreen = document.querySelector("#fullScreen");
const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");
const playBtnIcon = playBtn.querySelector("i");
const muteBtnIcon = muteBtn.querySelector("i");
const fullScreenIcon = fullScreen.querySelector("i");
const centerIcon = document.querySelector("#center-play i");
const centerBox = document.querySelector("#videoControls__center");
const defalutVolume = 0.2;
let inputVolume = defalutVolume;
let eventVolume = defalutVolume;
video.volumn = defalutVolume;
let videoPlayStatus = false;
let setVideoPlayStatus = false;
let controlsTimeout = null;
let controlsMovementTimeout = null;
let controlCenterIcon = null;

const formatTime = (seconds) => {
  if (seconds > 3600) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  }
};
function removeClass() {
  centerBox.classList.add("none");
}
const videoPlay = (event) => {
  if (video.paused) {
    video.play();
    centerIcon.classList = "fas fa-pause";
    controlCenterIcon = setTimeout(removeClass, 1000);
  } else {
    clearTimeout(controlCenterIcon);
    controlCenterIcon = null;
    centerBox.classList.remove("none");
    video.pause();
    centerIcon.classList = "fas fa-play";
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const videoMute = (event) => {
  if (!video.muted) {
    video.muted = true;
  } else {
    video.muted = false;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumnRange.value = video.muted
    ? 0
    : inputVolume < eventVolume
    ? eventVolume
    : inputVolume;
  video.volume = volumnRange.value;
};

const changeVolumn = (e) => {
  const {
    target: { value },
  } = e;

  if (value === "0") {
    video.muted = true;
  } else {
    video.muted = false;
  }
  inputVolume = value;
  video.volume = value;
  console.log(eventVolume);
  console.log(inputVolume);
};

const setVolumn = (e) => {
  const {
    target: { value },
  } = e;
  if (Number(value) === 0) {
    muteBtn.innerText = "Unmute";
    video.muted = true;
  } else {
    eventVolume = value;
  }
};

const handleMetadata = (e) => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};

const handleVideoTime = (e) => {
  currenTime.innerText = formatTime(Math.floor(e.target.currentTime));
  timeLine.value = Math.floor(e.target.currentTime);
};

const handleVideoRange = (e) => {
  const {
    target: { value },
  } = e;
  if (!setVideoPlayStatus) {
    videoPlayStatus = video.paused ? false : true;
    setVideoPlayStatus = true;
  }
  video.pause();
  video.currentTime = value;
};

const handleTimelineSet = () => {
  videoPlayStatus ? video.play() : video.pause();
  setVideoPlayStatus = false;
};

const handleFullScreen = () => {
  if (document.fullscreenElement === null) {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};
const hideControls = () => videoControls.classList.remove("showing");

const handelMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handelMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
  //다시 화면으로 돌아오면 timeOut을 취소해야 한다.
};

const handleVideoClick = (event) => {
  videoPlay();
};

const handleVideoKey = (event) => {
  const { keyCode } = event;
  if (keyCode === 32) {
    videoPlay();
  }
};

const hadleEnded = () => {
  const { videoid } = videoContainer.dataset;
  fetch(`/api/videos/${videoid}/view`, {
    method: "post",
  });
};

playBtn.addEventListener("click", videoPlay);
muteBtn.addEventListener("click", videoMute);
volumnRange.addEventListener("input", changeVolumn);
volumnRange.addEventListener("change", setVolumn);
video.addEventListener("loadedmetadata", handleMetadata);
video.addEventListener("timeupdate", handleVideoTime);
timeLine.addEventListener("input", handleVideoRange);
timeLine.addEventListener("change", handleTimelineSet);
fullScreen.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handelMouseMove);
videoContainer.addEventListener("mouseleave", handelMouseLeave);
video.addEventListener("click", handleVideoClick);
document.addEventListener("keydown", handleVideoKey);
video.addEventListener("ended", hadleEnded);
