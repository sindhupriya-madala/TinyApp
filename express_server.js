const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  let templateVars = {urls : urlDatabase };
  res.render('urls_index', templateVars);
});

// express get when client hit url '/urls/new'
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// express get when client hit url '/urls/shortlink'
app.get("/urls/:id", (req, res) => {
  //templateVars contains shortURL from request parameters and corresponding
  //longURL from urlDatabase.
  let templateVars = { shortURL: req.params.id,
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
  //res.redirect(`${longURL}`);
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
  consolreq.body
  delete urlDatabase[key];
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  let newURL = req.body.newURL;
  console.log(newURL);
  urlDatabase[req.params.id] = newURL;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});