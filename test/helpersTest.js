const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

// const testUsers = {
//   userRandomID: {
//     1: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur",
//   },
//   user2RandomID: {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk",
//   },
// };
const testUsers = {
  1: { id: "1", email: "cjt@123.com", password: bcrypt.hashSync("123", 10) },
  2: { id: "2", email: "ojt@123.com", password: bcrypt.hashSync("1234", 10) },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
  });
});
