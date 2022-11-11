const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

//helper functions
const {
  getUserByEmail,
  generateRandomString,
  passwordCheck
} = require("./helper");

//Store users
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};




app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");


//Register New user
app.post("/register", (req, res) => {
  const randomId = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (email.length === 0 || password.length === 0) {
    return res.status(400).send("Email and Password cannot be empty");
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email already exists");
  }
  users[randomId] = {
    id: randomId,
    email: email,
    password: password
  };
  res.cookie("user_id", randomId);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//update
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect('/urls');
});

//delete
app.post('/urls/:id/delete', (req, res) => {
  const urlId = req.params.id;
  delete urlDatabase[urlId];
  res.redirect('/urls');
});


//login cookie
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users)
console.log(user)
  if (!user) {
    return res.status(403).send("Email doesn't exist");
    
  }
 else {
    if (passwordCheck(users, email, password)) {
      res.cookie('user_id', user.id);
      res.redirect("urls");
      return
    } 
    res.cookie("user_id", user.id);
   res.status(403).send("Incorrect password");
  }
});


app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/login`);
});


app.get("/login", (req, res) => {
  const userID = req.cookies && req.cookies.user_id;
  const templateVars = {
    user: users[userID] || null,
  };
  if (userID) {
    res.redirect("/urls");
  }
  res.render("urls_login", templateVars)

})

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };

  res.render("urls_new", templateVars);
});
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});
app.get("/u/:id", (req, res) => {
  let id = req.params.id;

  const longURL = urlDatabase[id];
  res.redirect(longURL);
});
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };

  res.render("urls_register", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



