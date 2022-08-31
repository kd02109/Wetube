const form = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");
const commentBox = document.getElementById("videoComment");
const deleteBtn = document.querySelectorAll("#delete");
console.log(deleteBtn);

const addComment = (text, id) => {
  const commentList = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const delet = document.createElement("span");
  delet.dataset.id = id;
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
  addComment(text, newCommentId);
};

const handleDeleteComment = async (event) => {
  //2 fetch.
  const video = videoContainer.dataset.videoid;
  const commentId = event.target.dataset.id;
  await fetch(`/api/videos/${video}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    //objec을 문자로 받아서 돌려준다
    body: JSON.stringify({ commentId }),
  });
};

deleteBtn.forEach((xBtn) => {
  //1 find Btn
  xBtn.addEventListener("click", handleDeleteComment);
});

if (form) {
  form.addEventListener("submit", handleSubmit);
}

//2 fetch
//3 db find
