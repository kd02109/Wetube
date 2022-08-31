const form = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");

const addComment = (text, id) => {
  const commentList = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const delet = document.createElement("span");
  newComment.dataset.id = id;
  icon.className = "fas fa-comment";
  span.innerText = `${text}`;
  delet.innerText = "❌";
  delet.id = "delete";
  newComment.className = "video__comment";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(delet);
  commentList.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const video = videoContainer.dataset.videoid;
  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${video}/comment`, {
    method: "POST",
    //headers는 request에 대한 정보를 담고 있다.
    headers: {
      "Content-Type": "application/json",
    },
    //objec을 문자로 받아서 돌려준다
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  const status = response.status;
  const { newCommentId } = await response.json();
  if (status === 201) {
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
