const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
};

app.get("/", (req, resp) => {
  // resp.send("Hello!, Is there anybody out there?");
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  resp.render("home_page", templateVars);
});
app.get("/urls.json", (req, resp) => {
  resp.json(urlDatabase);
});
app.get("/hello", (req, resp) => {
  resp.send("<html><body>Is there anybody <b>Out there?</b></body></html>\n");
});
// my URLs page
app.get("/urls", (req, resp) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  resp.render("urls_index", templateVars);
});
// new page
app.get("/urls/new", (req, resp) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  resp.render("urls_new", templateVars);
});
// adds new link
app.post("/urls", (req, resp) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  //make sure this does not have the colon or it wont work
  console.log("we came through here");
  resp.redirect(`/urls/${shortURL}`);
  // console.log(urlDatabase);
});
// redirect when clicking on short url
app.get("/u/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  resp.redirect(longURL);
});
// go to tiny url page
app.get("/urls/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  console.log("shortURL", shortURL);
  console.log("longURL", longURL);
  const templateVars = {
    shortURL,
    longURL,
    username: req.cookies["username"],
  };
  resp.render("urls_show", templateVars);
});
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
app.post("/login", (req, resp) => {
  const username = req.body.username;

  resp.cookie("username", username);
  console.log("req.body.username", username);

  resp.redirect("/urls");
});

app.post("/logout", (req, resp) => {
  //
  const username = req.body.username;
  resp.clearCookie("username", username);
  resp.redirect("/");
});

//

// wild card 404 error
app.get("*", (req, resp) => {
  resp.redirect("https://httpstatusdogs.com/img/404.jpg");
});

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

// app.use(express.static('path_to_images)
