import Video from "../models/Video";

export const homepage = async (req, res) => {
  //db에서 데이터가 완전히 전달 될때까지 기다린 후 실행이 되어야 한다.
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos: videos });
  } catch (error) {
    return res.render("server-error", error);
  }
};

export function edit(req, res) {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Edit` });
}

export function search(req, res) {
  return res.send("Search video");
}

export async function watch(req, res) {
  const id = req.params.id; //const {id} = req.params
  const video = await Video.findById(id);
  return res.render("watch", { pageTitle: video.title, video });
}

export function removeVideo(req, res) {
  console.log(req.params);
  return res.send("delete video");
}
export function upload(req, res) {
  return res.render("upload", { pageTitle: "Upload" });
}

export const editTitle = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const { title } = req.body;
  const video = await Video.findById(id);
  video.title = title;
  video.views = 0;
  video.rating = 0;
  await video.save();
  return res.redirect(`/videos/${id}`);
};

export const saevUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title: title,
      description: description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect(`/`);
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload",
      errorMassage: error._message,
    });
  }
};
