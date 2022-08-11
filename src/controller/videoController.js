const fakeVideo = [
  {
    title: "#video1",
    rating: 5,
    comment: 2,
    createdAt: "2min",
    view: 1,
    id: 1,
  },
  {
    title: "#video2",
    rating: 5,
    comment: 2,
    createdAt: "2min",
    view: 59,
    id: 2,
  },
  {
    title: "#video3",
    rating: 5,
    comment: 2,
    createdAt: "2min",
    view: 59,
    id: 3,
  },
  {
    title: "#video3",
    rating: 5,
    comment: 2,
    createdAt: "2min",
    view: 59,
    id: 4,
  },
];

export function homepage(req, res) {
  return res.render("home", { pageTitle: "Home", fakeVideo });
}

export function edit(req, res) {
  const { id } = req.params;
  const video = fakeVideo[id - 1];
  return res.render("edit", { pageTitle: `${video.title} Edit`, video });
}

export function search(req, res) {
  return res.send("Search video");
}

export function watch(req, res) {
  const id = req.params.id; //const {id} = req.params
  const video = fakeVideo[id - 1];
  console.log("Show video", id);
  return res.render("watch", { pageTitle: `Watch ${video.title}`, video });
}

export function removeVideo(req, res) {
  console.log(req.params);
  return res.send("delete video");
}
export function upload(req, res) {
  return res.send("video upload");
}

export const editTitle = (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const { title } = req.body;
  console.log(title);
  fakeVideo[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
