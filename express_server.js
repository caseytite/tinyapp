// const { response } = require("express");
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
};

app.get("/", (req, resp) => {
  resp.send("Hello!, Is there anybody out there?");
});
app.get("/urls.json", (req, resp) => {
  resp.json(urlDatabase);
});
app.get("/hello", (req, resp) => {
  resp.send("<html><body>Is there anybody <b>Out there?</b></body></html>\n");
});
app.get("/urls", (req, resp) => {
  const templateVars = { urls: urlDatabase };
  resp.render("urls_index", templateVars);
});

app.get("/urls/new", (req, resp) => {
  resp.render("urls_new");
});
app.post("/urls", (req, resp) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  //make sure this does not have the colon or it wont work
  resp.redirect(`/urls/${shortURL}`);
  console.log(urlDatabase);
});

app.get("/u/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  resp.redirect(longURL);
});

app.get("/urls/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[`${shortURL}`];

  const templateVars = {
    shortURL,
    longURL,
  };
  resp.render("urls_show", templateVars);
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
