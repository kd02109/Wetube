import Video from "../models/Video";

export const homepage = async (req, res) => {
  //db에서 데이터가 완전히 전달 될때까지 기다린 후 실행이 되어야 한다.
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos: videos });
  } catch (error) {
    return res.status(404).render("server-error", error);
  }
};

export async function edit(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  }
  return res.render("edit", { pageTitle: `Edit`, video });
}

export async function watch(req, res) {
  const id = req.params.id; //const {id} = req.params
  const video = await Video.findById(id);
  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  }
  return res.status(404).render("404", { pageTitle: "Video not found!" });
}

export async function deleteVideo(req, res) {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
}
export async function upload(req, res) {
  const videos = await Video.find({});
  return res.render("upload", { pageTitle: "Upload", videos });
}

export const editTitle = async (req, res) => {
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  const { title, description, hashtags } = req.body;
  if (video === false) {
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const saevUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/`);
  } catch (error) {
    console.log(error);
    return res.status(404).render("upload", {
      pageTitle: "Upload",
      errorMassage: error._message,
    });
  }
};

export async function search(req, res) {
  const keyward = req.query.title;
  console.log(keyward);
  let videos = [];
  if (keyward) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyward, "i"),
      },
    });
  }
  console.log(videos);
  return res.render("search", { pageTitle: "Search", videos });
}
