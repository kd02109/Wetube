import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const homepage = async (req, res) => {
  //db에서 데이터가 완전히 전달 될때까지 기다린 후 실행이 되어야 한다.
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos: videos });
  } catch (error) {
    return res.status(404).render("server-error", error);
  }
};

export async function edit(req, res) {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
    //forbiden=403
  }
  return res.render("edit", { pageTitle: `Edit`, video });
}

export async function watch(req, res) {
  const id = req.params.id; //const {id} = req.params
  const video = await Video.findById(id).populate("owner");
  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  }
  return res.status(404).render("404", { pageTitle: "Video not found!" });
}

export async function deleteVideo(req, res) {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
    //forbiden=403
  }

  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
}
export async function upload(req, res) {
  const videos = await Video.find({});
  return res.render("upload", { pageTitle: "Upload", videos });
}

export const editTitle = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  if (video === false) {
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");

    //forbiden=403
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const saevUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  console.log(video, thumb);
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();
    //이떄 hash가 일어나기 때문에 수정이
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
    }).populate("owner");
  }
  console.log(videos);
  return res.render("search", { pageTitle: "Search", videos });
}

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  return res.sendStatus(201);
};
