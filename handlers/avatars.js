const router = require("express").Router();
const User = require("../classes/User");
const upload = require("multer")();
const fs = require("fs");
const path = require("path");

const allowedExts = ["jpg", "png"];

router.use(async (req, res, next) => {
  if (!req.user) {
    res.status(403);
    res.send({ message: "Unauthorized", status: 403 });
    return;
  }
  req.db_user = await User.findOne({ _id: req.user.id });
  if (!req.db_user) {
    res.status(403);
    res.send({ message: "Unauthorized", status: 403 });
    return;
  }
  next();
});

router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  let originalExt = file.originalname.split(".")[1];
  const id = req.db_user._id;
  let okay = false;

  for (ext of allowedExts) {
    if (originalExt === ext) {
      okay = true;
    }
  }

  if (okay) {
    fs.writeFileSync(
      path.join(__dirname, "..", "avatars", `${id}.${originalExt}`),
      file.buffer
    );
    await req.db_user.updateOne({ avatar: `/avatar/${id}.${originalExt}` });
    res.send({ message: "OK" });
  } else {
    res.status(406);
    res.send({ message: "Invalid file format", status: 406 });
  }
});

module.exports = router;
