const db = require("../../data/dbConfig");

const findById = async (id) => {
  return db("users").where("id", id).first();
};

const createUser = async (user) => {
  let result = await db("users").insert(user);
  return findById(result);
};

module.exports = { findById, createUser };
