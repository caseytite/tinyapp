const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

const {
  generateRandomString,
  getUserByEmail,
  validateUser,
  urlsForUser,
} = require('./helpers');

// middleware-------------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(
  cookieSession({
    name: 'session',
    keys: ['sic mundus creatus est', ' and thus the world was created'],
  })
);

//------------------------------------------------------------------------

// const password123 = "isthereanybodyoutthere";
// const hashed = bcrypt.hashSync(password123, 10);
// console.log("hashed password = ", hashed);
// console.log(bcrypt.compareSync("isthereanybodyoutthere", hashed));
// Data-------------------------------------------------------------------

const urlDatabase = {
  b6UTxQ: {
    longURL: 'https://www.tsn.ca',
    userID: '1',
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    userID: '1',
  },
};
const users = {
  1: { id: '1', email: 'cjt@123.com', password: bcrypt.hashSync('123', 10) },
  2: { id: '2', email: 'ojt@123.com', password: bcrypt.hashSync('1234', 10) },
};

//------------------------------------------------------------------------

//
// Home page--------------------------------------------------------------here
//
app.get('/', (req, resp) => {
  const userLoggedIn = req.session.user_id;
  if (userLoggedIn) {
    const templateVars = {
      urls: urlDatabase,
      user: users[userLoggedIn.id],
    };
    resp.render('home_page', templateVars);
  } else {
    const templateVars = {
      user: null,
    };
    resp.render('home_page', templateVars);
  }
});
//
// Test codes-------------------------------------------------------------
//
app.get('/urls.json', (req, resp) => {
  resp.json(urlDatabase);
});
app.get('/hello', (req, resp) => {
  resp.send('<html><body>Is there anybody <b>Out there?</b></body></html>\n');
});

//
// my URLs page-----------------------------------------------------------
//
app.get('/urls', (req, resp) => {
  const userLoggedIn = req.session.user_id;

  if (userLoggedIn) {
    const userUrls = urlsForUser(userLoggedIn.id, urlDatabase);
    const templateVars = {
      urls: userUrls,
      user: users[userLoggedIn.id],
    };
    resp.render('urls_index', templateVars);
  } else {
    resp.redirect('/login');
  }
});

//
// Page for new URL-------------------------------------------------------
//
app.get('/urls/new', (req, resp) => {
  const userLoggedIn = req.session.user_id;
  if (userLoggedIn) {
    const templateVars = {
      urls: urlDatabase,
      user: users[userLoggedIn.id],
    };

    resp.render('urls_new', templateVars);
  } else {
    resp.redirect('/login');
  }
});
//
// goes to actual url page------------------------------------------------
//
app.get('/u/:shortURL', (req, resp) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  resp.redirect(longURL);
});
//
//-----gots to url page when logged in------------------------------------
//
app.get('/urls/:shortURL', (req, resp) => {
  const userLoggedIn = req.session.user_id;

  if (userLoggedIn) {
    const shortURL = req.params.shortURL;

    const templateVars = {
      shortURL,
      longURL: urlDatabase[shortURL].longURL,
      urls: urlDatabase,
      user: users[userLoggedIn.id],
    };

    resp.render('urls_show', templateVars);
  } else {
    resp.redirect('/login');
  }
  // if (resp.body === undefined) {
  //   resp.redirect('https://httpstatusdogs.com/img/404.jpg');
  // }
});
//
// Logs in----------------------------------------------------------------
//
app.get('/login', (req, resp) => {
  const templateVars = {
    user: null,
  };
  resp.render('login_page', templateVars);
});
//
// Register---------------------------------------------------------------
//
app.get('/register', (req, resp) => {
  const templateVars = {
    user: null,
  };

  resp.render('register_page', templateVars);
});
//
//  Post to add new link--------------------------------------------------
//
app.post('/urls', (req, resp) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.session.user_id.id;

  urlDatabase[shortURL] = { longURL: longURL, userID: userID };

  resp.redirect(`/urls/${shortURL}`);
});
//

//
// Deletes a URL----------------------------------------------------------
//
app.post('/urls/:shortURL/delete', (req, resp) => {
  const userLoggedIn = req.session.user_id.id;
  if (userLoggedIn) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    resp.redirect('/urls');
  } else {
    resp.send('unauthorized');
  }
});
//
// gots to short url page
//
app.post('/urls/:shortURL', (req, resp) => {
  const userLoggedIn = req.session.user_id.id;

  if (userLoggedIn) {
    const shortURL = req.params.shortURL;

    urlDatabase[shortURL].longURL = req.body.longURL;

    resp.redirect('/urls');
  } else {
    resp.send('unauthorized');
  }
});

//
// logs user in-----------------------------------------------------------
//
app.post('/login', (req, resp) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashed = bcrypt.hashSync(password, 10);

  bcrypt.compareSync(password, hashed);

  const user = validateUser(email, hashed, password, users);
  if (user) {
    req.session.user_id = user;
    resp.redirect('/urls');
  } else {
    resp.redirect('https://httpstatusdogs.com/img/404.jpg');
  }
});

//
// Logs out---------------------------------------------------------------
//
app.post('/logout', (req, resp) => {
  req.session = null;
  resp.redirect('/urls');
});

//
// Register Form submit---------------------------------------------------
//
app.post('/register', (req, resp) => {
  //
  const newUID = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  if (newEmail === '' || newPassword === '') {
    resp.redirect('https://httpstatusdogs.com/img/404.jpg');
    resp.end();
  } else if (getUserByEmail(newEmail, users)) {
    //
    resp.redirect('https://httpstatusdogs.com/img/404.jpg');
    resp.end();
  } else {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    users[newUID] = { id: newUID, email: newEmail, password: hashedPassword };

    req.session.user_id = users[newUID];
    resp.redirect('/urls');
  }
});
//
// wild card 404 error----------------------------------------------------
//
app.get('*', (req, resp) => {
  resp.redirect('https://httpstatusdogs.com/img/404.jpg');
});

//
// Server listening-------------------------------------------------------
//
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
