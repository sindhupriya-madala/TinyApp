const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['asd', 'zxc'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use((req, res, next) => {
  const userId = req.session.user_id;
  req.user = users[userId];
  next();
})
app.set("view engine", "ejs");

let urlDatabase = {
  "userRandomID":{ "b2xVn2": "http://www.lighthouselabs.ca"},
  "user2RandomID":{ "9sm5xK": "http://www.google.com"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

function checkURLDatabase(shortURL) {
  for(let userid in urlDatabase) {
    if(Object.keys(urlDatabase[userid]) == shortURL) {
      return true;
    }
  }
  return false;
}

//function for generating string of 6 random characters.
function generateRandomString() {
var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i <= 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get("/", (req,res) => {
  res.redirect('register');
});

// express get when client hit url '/urls.json'
app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

// express get when client hit url '/'
app.get("/hello", (req,res) => {
  res.end("<html><body>Hello <b> World </b> </body> </html> \n");
});

//express get when we hits url '/urls'
app.get("/urls", (req,res) => {
  if(req.user) {
    res.render('urls_index',{user : req.user, urlDB : urlDatabase[req.user.id]});
  } else {
    res.status(401);
    res.render('link-to-login');
  }
});

// express get when client hit url '/urls/new'
app.get("/urls/new", (req, res) => {
  if(req.user) {
    res.render("urls_new", { user: req.user });
  } else {
    res.status(401);
    res.render('link-to-login');
  }
});

// express get when client hit url '/urls/shortlink'
app.get("/urls/:id", (req, res) => {
  //templateVars contains shortURL from request parameters and corresponding
  //longURL from urlDatabase.
  const shortURL= req.params.id;
  if(checkURLDatabase(shortURL)) {
    if(req.user) {
      if(Object.keys(urlDatabase[req.user.id]) == shortURL) {
        let templateVars = {  user : users[req.session.user_id],
                              shortURL: shortURL,
                              lURL:urlDatabase[req.params.id]
                            };
        // renders urls_show to webbrowser with templateVars.
        res.render("urls_show", templateVars);
      } else {
        res.status(403);
        res.render('error', {statusCode : 403});
      }
    } else {
      res.status(401);
      res.render('link-to-login');
    }
  } else {
    res.status(404);
    res.render('error',{statusCode : 404});
  }
});

function prepareLongURL(longURL) {
  if(!(longURL.includes('http://')||longURL.includes('https://'))) {
    longURL = `http://${longURL}`;
  }
  return longURL;
}
//POST
app.post("/abcd", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  longURL = prepareLongURL(longURL);
  urlDatabase[req.user.id][""+shortURL] =  longURL;
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  for(let urlsOfUser in urlDatabase) {
    Object.keys(urlDatabase[urlsOfUser]).forEach((key) => {
      if(req.params.shortURL == key) {
        x = 1;
        let longURL = urlDatabase[urlsOfUser][key];
        res.redirect(`${longURL}`);
      }
    });
  }
  res.render('error',{statusCode : 404});
});

//POST for deleting a url from urls page.
app.post("/urls/:id/delete", (req, res) => {
  let key = req.params.id;
  delete urlDatabase[req.user.id][key];
  res.redirect('/urls');
});

app.get("/urls/:id/edit", (req, res) => {
  let key = req.params.id;
  res.render("url-update",{shortURL : key});
});

app.post("/urls/:id/edit", (req, res) => {
  let key = req.params.id;
  let longURL = req.body.longURL;
  longURL = prepareLongURL(longURL);
  urlDatabase[req.user.id][key] = longURL;
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  let newURL = req.body.newURL;
  urlDatabase[req.params.id] = newURL;
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if(email && password) {
    for (user in users) {
      if (users[user].email === email) {
        if(bcrypt.compareSync(password, users[user].password)){
          req.session.user_id = users[user].id;
          res.redirect("/urls");
        }
        res.status(403);
      }
    }
    res.render('error',{statusCode : 401});
  } else {
    res.status(403);
    res.send("please fill email and password ! ");
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

const emailExists = email => {
  // check all users emails and see if new email is part of it
  for (user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
}

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password,10);
  if (email && password) {
    if (emailExists(email,false)) {
      res.status(400);
      res.send("email exists!");
    } else {
      const id = generateRandomString();
      users[id] = { id, email, password };
      urlDatabase[id] = {};
      req.session.user_id = id;
      res.redirect("/urls");
    }
  } else {
      res.status(404);
      res.send('Not found');
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});