// const { users } = require("./express_server");

function generateRandomString() {
  let output = "";
  let randoms = "123456789abcdefghi";
  for (let i = 0; i < 6; i++) {
    output += randoms[Math.floor(Math.random() * 18)];
  }

  return output;
}

module.exports = {
  generateRandomString,
};
