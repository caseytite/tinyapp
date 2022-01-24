// const { response } = require("express");
const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
app.get("/urls/:shortURL", (req, resp) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  resp.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
