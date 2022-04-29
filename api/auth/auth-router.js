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

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

module.exports = router;
