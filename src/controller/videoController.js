export function homepage(req, res) {
  return res.send("Homepage Video");
}

export function edit(req, res) {
  console.log(req.params);
  return res.send("Edit Videos");
}

export function search(req, res) {
  return res.send("Search video");
}

export function see(req, res) {
  console.log(req.params);
  return res.send(`watch video #${req.params.id}`);
}

export function removeVideo(req, res) {
  console.log(req.params);
  return res.send("delete video");
}
export function upload(req, res) {
  return res.send("video upload");
}
