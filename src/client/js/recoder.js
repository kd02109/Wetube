const startBtn = document.getElementById("startBtn");
const preview = document.getElementById("preview");

let stream;
let recoder;
let videoFile;

const handleDownlowd = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "My Recording.webm";
  document.body.appendChild(a);
  a.click();
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });
  stream = null;
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownlowd);
  recoder.stop();
};

const handleStartBtn = () => {
  recoder = new MediaRecorder(stream);
  recoder.ondataavailable = (e) => {
    videoFile = URL.createObjectURL(e.data);
    preview.srcObject = null;
    preview.src = videoFile;
    preview.loop = true;
    preview.play();
  };
  recoder.start();
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStartBtn);
  startBtn.addEventListener("click", handleStop);
};

//미리보기 기능,
const init = async () => {
  let settiog = { audio: false, video: true };
  stream = await navigator.mediaDevices.getUserMedia(settiog);
  preview.srcObject = stream;
  preview.play();
};
init();

startBtn.addEventListener("click", handleStartBtn);
