// const { users } = require("./express_server");

function generateRandomString() {
  let output = "";
  let randoms = "123456789abcdefghi";
  for (let i = 0; i < 6; i++) {
    output += randoms[Math.floor(Math.random() * 18)];
  }

  return output;
}
function checkUser(newEmail, users) {
  for (let user in users) {
    if (newEmail == users[user].email) {
      return true;
    }
  }
  return false;
}

module.exports = {
  generateRandomString,
  checkUser,
};
