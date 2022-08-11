export function homepage(req, res) {
  const fakeVideo = [
    {
      title: "#video1",
      rating: 5,
      comment: 2,
      createdAt: "2min",
      view: 59,
      id: 1,
    },
    {
      title: "#video2",
      rating: 5,
      comment: 2,
      createdAt: "2min",
      view: 59,
      id: 1,
    },
    {
      title: "#video2",
      rating: 5,
      comment: 2,
      createdAt: "2min",
      view: 59,
      id: 1,
    },
    {
      title: "#video3",
      rating: 5,
      comment: 2,
      createdAt: "2min",
      view: 59,
      id: 1,
    },
  ];
  return res.render("home", { pageTitle: "Home", fakeVideo });
}

export function edit(req, res) {
  console.log(req.params);
  return res.render("edit");
}

export function search(req, res) {
  return res.send("Search video");
}

export function see(req, res) {
  console.log(req.params);
  return res.render("watch");
}

export function removeVideo(req, res) {
  console.log(req.params);
  return res.send("delete video");
}
export function upload(req, res) {
  return res.send("video upload");
}
