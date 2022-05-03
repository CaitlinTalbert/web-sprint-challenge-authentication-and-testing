const db = require("../data/dbConfig");
const Users = require("./auth/auth-model");
const request = require("supertest");
const server = require("./server");
const bcrypt = require("bcryptjs");

//- [ ] A minimum of 2 tests per API endpoint, written inside `api/server.test.js`.
const newUser = { username: "Caitlin", password: "momo" };
const user1 = {
  username: "",
  password: "",
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

test("make sure our environment is set correctly", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

test("server is up", async () => {
  const res = await request(server).get("/");
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ api: "up" });
});

describe("tests the users db", () => {
  test("the table is empty", async () => {
    const users = await db("users");
    expect(users).toHaveLength(0);
  });

  test("users can be inserted", async () => {
    const result = await Users.createUser({
      username: "caitlin",
      password: "momo",
    });
    expect(result).toEqual({ id: 1, username: "caitlin", password: "momo" });
    let users = await db("users");
    expect(users).toHaveLength(1);
  });
});

describe("test API endpoints", () => {
  test("[POST] /api/auth/register", async () => {
    let res = await request(server)
      .post("/api/auth/register")
      .send({ username: "caitlin", password: "momo" });
    expect(res.status).toBe(200);
  });
  test("[POST] /api/auth/register, saves users bcrypted password instead of plain text", async () => {
    await request(server).post("/api/auth/register").send(newUser);
    const Caitlin = await db("users").where("username", "Caitlin").first();
    expect(bcrypt.compareSync("momo", Caitlin.password)).toBeTruthy();
  }, 750);
  // test("[POST] /api/auth/login, responds with welcome message on successful login", async () => {
  //   let res = await request(server).post("/api/auth/login").send(user1);
  //   expect(res.body.message).toEqual(`welcome, ${user1.username}`);
  // });
  test("[POST] /api/auth/login, responds with status 400 - username and password required", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "", password: "idk" });
    expect(res.status).toBe(400);
  }, 750);
  test("[POST] /api/auth/login, responds with status 404 - invalid credentials", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "asdf", password: "5678" });
    expect(res.status).toBe(404);
  });
});
