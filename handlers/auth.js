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

  if (!login || !unencoded_password || !name || !email) {
    res.status(400);
    res.send({ message: "Not enough data" });
    return;
  }

  if (!email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
    res.status(400);
    res.send({ message: "Email invalid" });
    return;
  }
  const password_length = unencoded_password.length;
  if( password_length < 8 ){
    res.status(400);
    res.send({ message: "Password too short" });
    return
  }

  // Check if user exists
  if (await User.findOne({ login: login })) {
    res.status(409);
    res.send({ message: "Login exists" });
    return
  }
  if (await User.findOne({ mail: email })) {
    res.status(409);
    res.send({ message: "Email already registered" });
    return;
  }

  const encoded_password = bcrypt.hashSync(unencoded_password, salt);
  newUser = new User({
    login: login,
    password: encoded_password,
    firstname: name,
    team_member: false,
    mail: email,
  });
  newUser.save();
  res.status(200)
  res.send({ message: "OK" });
});

router.post("/login", async (req, res) => {
  const login = req.body?.login;
  const password = req.body?.password;

  if (!login || !password) {
    res.status(400);
    res.send({ message: "BAD REQUEST" });
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
      res.status(403);
      res.json({message:"Password invalid"})
    }
  } else {
    res.status(404);
    res.json({message:"User not found"})
  }
});



module.exports = router;
