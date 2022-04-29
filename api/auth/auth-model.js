const db = require("../../data/dbConfig");

const findByUsername = async (username) => {
  let result = await db("users").where("username", username);
  return result[0];
};

const findById = async (id) => {
  return db("users").where("id", id).first();
};

const createUser = async (user) => {
  let result = await db("users").insert(user);
  return findById(result);
};

module.exports = { findById, createUser, findByUsername };
