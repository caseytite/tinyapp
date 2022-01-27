const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const res = require("express/lib/response");

// middleware------

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

//---------------

// Data----------

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "1",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "2",
  },
};
const users = {
  1: { id: 1, email: "cjt@123.com", password: "123" },
  2: { id: 2, email: "ojt@123.com", password: "123" },
};

//---------------

//
// Home page
//
app.get("/", (req, resp) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id],
  };
  resp.render("home_page", templateVars);
});
//
// Test codes
//
app.get("/urls.json", (req, resp) => {
  resp.json(urlDatabase);
});
app.get("/hello", (req, resp) => {
  resp.send("<html><body>Is there anybody <b>Out there?</b></body></html>\n");
});

//
// my URLs page
//
app.get("/urls", (req, resp) => {
  const loggedIn = req.cookies.user_id;

  if (loggedIn) {
    const userUrls = {};
    for (let urlId in urlDatabase) {
      const url = urlDatabase[urlId];
      if (url["userID"] === loggedIn) {
        userUrls[urlId] = url.longURL;
      }
    }

    const templateVars = {
      urls: userUrls,
      user: users[req.cookies.user_id],
    };

    resp.render("urls_index", templateVars);
  } else {
    resp.redirect("/login");
  }
});

//
// Page for new URL
//
app.get("/urls/new", (req, resp) => {
  console.log(req.cookies.user_id);
  const loggedIn = req.cookies.user_id;
  if (loggedIn) {
    const templateVars = {
      urls: urlDatabase,
      user: users[req.cookies.user_id],
    };

    resp.render("urls_new", templateVars);
  } else {
    resp.redirect("/login");
  }
});
//
//  Post to add new link
//
app.post("/urls", (req, resp) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.cookies.user_id;

  urlDatabase[shortURL] = { longURL: longURL, userID: userID };
  console.log(req.cookies.user_id);

  resp.redirect(`/urls/${shortURL}`);
});
//
// redirect when clicking on short url
//
app.get("/u/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  resp.redirect(longURL);
});
//
// go to tiny url page
//
app.get("/urls/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    urls: urlDatabase,
    user: users[req.cookies.user_id],
    // users: users,----
  };
  resp.render("urls_show", templateVars);
});
//
// Deletes a URL
//
app.post("/urls/:shortURL/delete", (req, resp) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  resp.redirect("/urls");
});
app.post("/urls/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;

  console.log("this page");
  urlDatabase[shortURL].longURL = req.body.longURL;

  resp.redirect("/urls");
});
//
// Logs in
//
app.get("/login", (req, resp) => {
  const templateVars = {
    user: null,
  };
  resp.render("login_page", templateVars);
});
//
// logs user in
//
app.post("/login", (req, resp) => {
  const email = req.body.email;
  console.log("email", email);
  const password = req.body.password;
  console.log(password);

  const user = validateUser(email, password);
  console.log("before if", user);
  if (user) {
    resp.cookie("user_id", user.id);
    console.log("if");
    resp.redirect("/urls");
  } else {
    console.log("else");
    // resp.status(403);
    resp.send(401).status("Unable to find the associated user credentials.");
    next();
  }
});

// A user cannot log in with an incorrect email/password

//
// Logs out
//
app.post("/logout", (req, resp) => {
  //
  const user_id = req.body.user_id;
  resp.clearCookie("user_id", user_id);
  resp.redirect("/");
  // resp.redirect("/urls");
});

//
// Register
//
app.get("/register", (req, resp) => {
  const templateVars = {
    user: null,
  };

  resp.render("register_page", templateVars);
});

//
// Register Form submit
//
app.post("/register", (req, resp) => {
  //
  const newUID = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  if (newEmail === "" || newPassword === "") {
    resp.statusCode = 400;
    resp.end();
  } else if (checkUser(newEmail)) {
    //
    resp.statusCode = 400;
    resp.end();
    console.log("user exists");
  } else {
    users[newUID] = { id: newUID, email: newEmail, password: newPassword };
    // console.log(users);
    console.log(users);
    console.log("user registerd");
    // console.log(users);

    resp.cookie("user_id", newUID);

    // console.log(users);
    resp.redirect("/urls");
  }
});
//
// wild card 404 error
//
app.get("*", (req, resp) => {
  resp.redirect("https://httpstatusdogs.com/img/404.jpg");
});

//
// Server listening
//
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

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
      console.log("user email", users[user].email);

      return true;
    }
  }
  return false;
}

const validateUser = function (email, password) {
  //
  for (let user in users) {
    console.log("in validate loop", users[user]);
    if (users[user].email === email) {
      console.log("yes");
      if (users[user].password === password) {
        return users[user];
      }
    }
  }
  return false;
};
// // app.use(express.static('path_to_images)
