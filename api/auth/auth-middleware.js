const Users = require("./auth-model");

async function validateBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json("username and password required");
  } else {
    req.userInput = req.body;
    next();
  }
}

async function checkIfExists(req, res, next) {
  Users.findByUsername(req.userInput.username).then((user) => {
    if (!user) {
      next();
    } else {
      res.status(400).json("username taken");
    }
  });
}

async function checkAuth(req, res, next) {
  Users.findByUsername(req.userInput.username).then((user) => {
    if (!user) {
      res.status(404).json("invalid credentials");
    } else {
      req.user = user;
      next();
    }
  });
}

module.exports = { validateBody, checkIfExists, checkAuth };
