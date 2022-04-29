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

module.exports = { validateBody };
