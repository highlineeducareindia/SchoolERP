const crypto = require("crypto");

function getRandomChar(str) {
  return str[crypto.randomInt(0, str.length)];
}

function shuffle(str) {
  return str
    .split("")
    .sort(() => crypto.randomInt(-1, 2))
    .join("");
}

function generatePassword() {

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "@#";

  const all = upper + lower + numbers + special;

  let password = "";

  // GUARANTEED one from each
  password += getRandomChar(upper);
  password += getRandomChar(lower);
  password += getRandomChar(numbers);
  password += getRandomChar(special);

  // Remaining (4 = total 8)
  for (let i = 0; i < 4; i++) {
    password += getRandomChar(all);
  }

  return shuffle(password);
}

module.exports = generatePassword;