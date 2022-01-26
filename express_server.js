const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// middleware------

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

//---------------

// Data----------

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
};
const users = {
  1: { id: 1, email: "cjt@123.com", password: 123 },
  2: { id: 2, email: "ojt@123.com", password: 123 },
};

//---------------

//
// Home page
//
app.get("/", (req, resp) => {
  // resp.send("Hello!, Is there anybody out there?");
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.user_id,
    users: users,
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
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.user_id,
    users: users,
  };
  console.log("in app.get urls", req.cookies.user_id);
  resp.render("urls_index", templateVars);
});

//
// Page for new URL
//
app.get("/urls/new", (req, resp) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.user_id,
    users: users,
  };
  resp.render("urls_new", templateVars);
});
//
//  Post to add new link
//
app.post("/urls", (req, resp) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  //make sure this does not have the colon or it wont work
  console.log("we came through here");
  resp.redirect(`/urls/${shortURL}`);
  // console.log(urlDatabase);
});
//
// redirect when clicking on short url
//
app.get("/u/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  resp.redirect(longURL);
});
//
// go to tiny url page
//
app.get("/urls/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  console.log("shortURL", shortURL);
  console.log("longURL", longURL);
  const templateVars = {
    shortURL,
    longURL,
    username: req.cookies.user_id,
    users: users,
  };
  resp.render("urls_show", templateVars);
});
//
// Deletes a URL
//
app.post("/urls/:shortURL/delete", (req, resp) => {
  //pull short url from params
  const shortURL = req.params.shortURL;
  //delete short url
  delete urlDatabase[shortURL];
  resp.redirect("/urls");
});
//longurl becomes the key because we assigned the input name to longurl ,short url the new value from resp body
app.post("/urls/:shortURL", (req, resp) => {
  //short url is still the same
  const shortURL = req.params.shortURL;
  //we search for the key and assign to the new value
  // of longURL which comes from the input name === key
  //the input value will be the "text content"
  urlDatabase[shortURL] = req.body.longURL;

  resp.redirect("/urls");
});
//
// Logs in
//
app.post("/login", (req, resp) => {
  const username = req.body.user_id;

  resp.cookie("user_id", username);
  console.log("req.body.username", username);

  resp.redirect("/urls");
});

//
// Logs out
//
app.post("/logout", (req, resp) => {
  //
  const username = req.body.user_id;
  resp.clearCookie("user_id", username);
  resp.redirect("/");
  // resp.redirect("/urls");
});

//
// Register
//
app.get("/register", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    username: req.cookies.user_id,
    users: users,
  };
  console.log("in reg get", req.cookies.user_id);
  // const username = req.body.username;

  // resp.cookie("username", username);
  // console.log("req.body.username regi", username);
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
  } else if (!checkUID(newEmail)) {
    //
    resp.statusCode = 400;
    resp.end();
    console.log("user exists");
  } else {
    users[newUID] = { id: newUID, email: newEmail, password: newPassword };

    resp.cookie("user_id", newUID);

    console.log(users);
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
  // console.log(output);
  return output;
}

function checkUID(newEmail) {
  for (let user in users) {
    if (newEmail === users[user].email) {
      console.log("user email", user.email);

      return false;
    } else {
      // resp.redirect("/register");
      console.log("good to go");
    }
  }
  return true;
}

// app.use(express.static('path_to_images)
