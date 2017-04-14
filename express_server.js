const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use((req, res, next) => {
  const userId = req.cookies.user_id;
  req.user = users[userId];
  next();
})
app.set("view engine", "ejs");

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
//function for generating string of 6 random characters.
function generateRandomString() {
var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i <= 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// express get when client hit url '/'
app.get("/", (req,res) => {
  res.end("hello there");
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
  let passData = {
                    user : req.user,
                    urls : urlDatabase
                  };
  res.render('urls_index', {user: req.user, urls: urlDatabase});
});

// express get when client hit url '/urls/new'
app.get("/urls/new", (req, res) => {
  // let user = { user : users[req.cookies.user_id]};
  res.render("urls_new", { user: req.user });
});

// express get when client hit url '/urls/shortlink'
app.get("/urls/:id", (req, res) => {
  //templateVars contains shortURL from request parameters and corresponding
  //longURL from urlDatabase.
  let templateVars = {  user : users[req.cookies.user_id],
                        shortURL: req.params.id,
                        lURL:urlDatabase[req.params.id]
                      };
  // renders urls_show to webbrowser with templateVars.
  res.render("urls_show", templateVars);
});

//POST
app.post("/abcd", (req, res) => {
  console.log(req.body.longURL);
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  if(!(longURL.includes('http://')||longURL.includes('https://'))) {
    longURL = `http://${longURL}`;
  }
  urlDatabase[shortURL] = longURL;
  console.log(`iam here : /u/${shortURL}`);
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

//POST for deleting a url from urls page.
app.post("/urls/:id/delete", (req, res) => {
  let key = req.params.id;
  //consolreq.body
  delete urlDatabase[key];
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  let newURL = req.body.newURL;
  console.log(newURL);
  urlDatabase[req.params.id] = newURL;
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  console.log("hello in login get");
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if(email && password) {
    for (user in users) {
      if (users[user].email === email) {
        if(users[user].password === password){
          res.cookie("user_id",users[user].id);
          res.redirect("/");
        }
        res.status(403);
        //res.send("password doesn't match ! ");
      }
    }
    res.status(403);
  } else {
    res.status(403);
    res.send("please fill email and password ! ");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie('user_id');
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
  const { email, password } = req.body;
  // validations (does password have 8 chars)
  if (email && password) {
    if (emailExists(email,false)) {
      res.status(400);
      res.send("email exists!");
    } else {
      const id = generateRandomString();
      users[id] = { id, email, password };
      res.cookie("user_id", id);
      res.redirect("/");
    }
  } else {
      res.status(404);
      res.send('Not found');
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});