const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  } return null;
};

const randomId = generateRandomString();








const passwordCheck = function(users, email, password) {
  const user = Object.values(users).find((user) => user.email === email);
  if (!user) return false;
  return user.password === password;
};

//returns the URLs where the userID is equal to the id of the currently logged-in user.
const urlsForUser = function(id, database) {
  let urls = {};
  for(let key in database) {
    const url = database[key]
    if (url.userID === id) {
      urls[key] = url;
    }
  }
  return urls;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  passwordCheck,
  urlsForUser,
  randomId
};