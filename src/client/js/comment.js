const form = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const video = videoContainer.dataset.videoid;
  if (text === "") {
    return;
  }

  fetch(`/api/videos/${video}/comment`, {
    method: "POST",
    //headers는 request에 대한 정보를 담고 있다.
    headers: {
      "Content-Type": "application/json",
    },
    //objec을 문자로 받아서 돌려준다
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
