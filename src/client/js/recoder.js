import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const preview = document.getElementById("preview");

let stream;
let recoder;
let videoFile;

const handleDownlowd = async () => {
  //step1.
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  //사용자가 소프트웨어를 사용하기 때문에 await을 활용
  // JS가 아닌 코드를 사용

  //setp2 ffmpeg에 파일을 만들기
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  //가상컴퓨터에 존재하는 파일을 받는 것이다.
  //이를 output 파일을 mp4로 변환한다.
  // 초당 60프레임으로 인코딩
  //이제 가상 파일 시스템에 output.mp4라는 파일이 있다.

  //step 3 가상화녕에서 파일 가져오기
  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "My Recording.mp4";
  document.body.appendChild(a);
  a.click();
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
