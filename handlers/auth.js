const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../classes/User");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(13);

router.post("/register", async (req, res) => {
  const login = req.body.login;
  const unencoded_password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;
  let valid = true;

  if (!login || !unencoded_password || !name || !email) {
    res.status(400);
    res.send({ is_valid: false, status: 400 });
    return;
  }

  if (!email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
    res.status(400);
    res.send({ is_valid: false, status: 400 });
    return;
  }

  // Check if user exists
  if (await User.findOne({ login: login })) {
    valid = false;
  }

  const encoded_password = bcrypt.hashSync(unencoded_password, salt);
  if (valid) {
    newUser = new User({
      login: login,
      password: encoded_password,
      firstname: name,
      team_member: false,
      mail: email,
    });
    newUser.save();
  }
  res.send({ message: "OK", is_valid: valid, status: 200 });
});

router.post("/login", async (req, res) => {
  const login = req.body?.login;
  const password = req.body?.password;

  if (!login || !password) {
    res.status(400);
    res.send({ is_valid: false, status: 400 });
    return;
  }

  const user =
    (await User.findOne({ login: login })) ||
    (await User.findOne({ mail: login }));

  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const data = {
        login: user.login,
        firstname: user.firstname,
        id: user._id,
        team_member: user.team_member,
        avatar: user.avatar,
      };
      const token = jwt.sign(data, process.env.TOKEN_SECRET, {
        expiresIn: "2d",
      });
      res.status(200);
      res.send({
        token: token,
        user: data,
        status: 200,
      });
    } else {
      status403(res);
    }
  } else {
    status403(res);
  }
});

function status403(res) {
  res.status(403);
  res.send({ message: "Login error", status: 403 });
}

module.exports = router;
