const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

//helper functions
const {
  getUserByEmail,
  generateRandomString,
  passwordCheck,
  urlsForUser
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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};




app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

//POST methods
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
  const userID = req.cookies && req.cookies.user_id;
  const user = users[userID]
  if (!user) {
    return res.status(401).send('Please login to use ShortURL!');
  };

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
  longURL: req.body.longURL,
  userID: req.cookies.user_id}

  res.redirect(`/urls/${shortURL}`);
});

//update
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const urlTar = urlDatabase[req.params.id]


  if(!userID) {
    return res.status(401).send("Log in first!")
  }

if(!urlTar) {
  return res.status(404).send("URL does not exist")
}
if(urlTar.userID !== userID) {
  return res.status(401).send("You do not have access")
}
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  res.redirect('/urls');
});

//delete
app.post('/urls/:id/delete', (req, res) => {
  const urlId = req.params.id;
  const urlTar = urlDatabase[req.params.id]


  if(!userID) {
    return res.status(401).send("Log in first!")
  }

if(!urlTar) {
  return res.status(404).send("URL does not exist")
}
if(urlTar.userID !== userID) {
  return res.status(401).send("You do not have access")
}

  delete urlDatabase[urlId].longURL;
  res.redirect('/urls');
});


//login cookie
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users)

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

//GET methods
//Main
app.get('/', (req, res) => {
  const userID = req.cookies && req.cookies.user_id;

  if (userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get("/login", (req, res) => {
  const userID = req.cookies && req.cookies.user_id;

  const templateVars = {
    user: users[userID] || null,
  };
  if (userID) {
    return res.redirect("/urls"); 
  }
  res.render("urls_login", templateVars)

})

app.get("/urls", (req, res) => {
  const userID = req.cookies && req.cookies.user_id;
  const user = users[userID]

  if (!user) {
    return res.redirect("/login"); 
  }
  const urls = urlsForUser (userID, urlDatabase);
  const templateVars = {urls, user};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies && req.cookies.user_id;
  const user = users[userID]

  if (!user) {
    return res.redirect("/login"); 
  } 

  const templateVars = { urls: urlDatabase, user };

  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.cookies.user_id;
   const urlTar = urlDatabase[req.params.id]


  if(!userID) {
    return res.status(401).send("Log in first!")
  }

if(!urlTar) {
  return res.status(404).send("URL does not exist")
}
if(urlTar.userID !== userID) {
  return res.status(401).send("You do not have access")
}
const templateVars = { 
  id: req.params.id, 
  longURL: urlTar.longURL, 
  user: users[userID]
};

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  let id = req.params.id;
  const longURL = urlDatabase[id].longURL;

  if (!longURL) {
    return res.send("<h1>Invalid ID!</h1>");
  }
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const userID = req.cookies && req.cookies.user_id;
  const user = users[userID]

   const templateVars = { user };

  if (userID) {
    return res.redirect("/urls"); 
  }


  res.render("urls_register", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



