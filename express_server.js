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
  console.log(req.body);
  resp.send("Ok");
});

app.get("/urls/:shortURL", (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[`${shortURL}`];
  console.log(longURL);
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
  let randoms = [1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  for (let i = 0; i < 6; i++) {
    output += randoms[Math.floor(Math.random() * 15)];
  }
  // console.log(output);
  return output;
}
