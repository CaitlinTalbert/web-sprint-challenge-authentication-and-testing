const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./auth-model");
const { validateBody, checkIfExists, checkAuth } = require("./auth-middleware");
const saltRounds = 8;

router.post("/register", validateBody, checkIfExists, async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.userInput.password, saltRounds);
    const obj = {
      username: req.userInput.username,
      password: hash,
    };
    Users.createUser(obj)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "internal database error", error: err });
      });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/login", validateBody, checkAuth, async (req, res) => {
  try {
    if (bcrypt.compareSync(req.userInput.password, req.user.password)) {
      const payload = {
        user_id: req.user.id,
        username: req.user.username,
        password: req.user.password,
      };
      const token = generateToken(payload);
      res.status(200).json({ message: `welcome, ${req.user.username}`, token });
    } else {
      res.status(400).json("invalid credentials");
    }
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

function generateToken(payload) {
  return jwt.sign(payload, "JWT_SECRET", { expiresIn: "1d" });
}

module.exports = router;
