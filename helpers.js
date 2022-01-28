const bcrypt = require('bcryptjs');

function generateRandomString() {
  let output = '';
  let randoms = '123456789abcdefghi';
  for (let i = 0; i < 6; i++) {
    output += randoms[Math.floor(Math.random() * 18)];
  }

  return output;
}
function getUserByEmail(newEmail, users) {
  for (let user in users) {
    if (newEmail == users[user].email) {
      return { id: users[user].id, email: users[user].email };
    }
  }
  return undefined;
}

const validateUser = function (email, hashed, password, users) {
  //
  for (let user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, hashed)) {
      return users[user];
    }
  }
  return false;
};
const urlsForUser = function (userLoggedIn, urlDatabase) {
  const userUrls = {};
  for (let urlId in urlDatabase) {
    const url = urlDatabase[urlId];
    if (url['userID'] === userLoggedIn) {
      userUrls[urlId] = url.longURL;
    }
  }
  return userUrls;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  validateUser,
  urlsForUser,
};
