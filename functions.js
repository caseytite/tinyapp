function generateRandomString() {
  let output = "";
  let randoms = "123456789abcdefghi";
  for (let i = 0; i < 6; i++) {
    output += randoms[Math.floor(Math.random() * 18)];
  }

  return output;
}

function checkUser(newEmail) {
  for (let user in users) {
    if (newEmail == users[user].email) {
      // console.log("user email", users[user].email);

      return true;
    }
  }
  return false;
}

const validateUser = function (email, password) {
  //
  for (let user in users) {
    // console.log("in validate loop", users[user]);
    if (users[user].email === email) {
      // console.log("yes");
      if (users[user].password === password) {
        return users[user];
      }
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  checkUser,
  validateUser
}
