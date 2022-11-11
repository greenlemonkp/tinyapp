const getUserByEmail = function(email, database ) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  } return null;
};


const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
}

const passwordCheck = function (users, email, password) {
  const user = Object.values(users).find((user) => user.email === email);
  if(!user) return false;
  return user.password === password;
}

module.exports = {
  getUserByEmail,
  generateRandomString,
  passwordCheck
};