const getUserByEmail = function(email, database ) {
  for (let user in database) {
    if (database[user].email === email) {
      return true;
    }
  }
  return false;
};


const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
}

module.exports = {
  getUserByEmail,
  generateRandomString
};