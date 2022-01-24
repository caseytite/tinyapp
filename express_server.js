const { response } = require("express");
const express = require("express");
const app = express();
const PORT = 8080;

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
  resp.send(
    "<html><body><h1>Is there anybody <b>Out there?</b></h1></body></html>\n"
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
