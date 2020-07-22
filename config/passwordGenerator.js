let passwordSpecialChars = '!@#$%^&*';
let lowerCaseChars = 'abcdefghijklmnopqrstuvqzyz';
let upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let numberchars = '12345678890';

module.exports = function generatePassword() {
  let passwordProperties = {
    containsLowerCase: true,
    containsUpperCase: true,
    containsNumber: true,
    containsSpecialCharacter: true,
    length: 8,
  };

  let passwordMatchingCritera = [];
  pushMinimumRequiredChars(passwordProperties, passwordMatchingCritera);
  //find out how many more characters need to be pushed into the array to satisfy the length requirement.
  pushRemainingCharacters(passwordProperties, passwordMatchingCritera);
  console.log('Generated password is: ' + passwordMatchingCritera.join(''));
  return passwordMatchingCritera.join('');
};

function pushMinimumRequiredChars(passwordProperties, passwordMatchingCritera) {
  if (passwordProperties.containsLowerCase) {
    passwordMatchingCritera.push(getRandomLowerCaseChar());
  }
  if (passwordProperties.containsUpperCase) {
    passwordMatchingCritera.push(getRandomUpperCaseChar());
  }
  if (passwordProperties.containsNumber) {
    passwordMatchingCritera.push(getRandomNumber());
  }
  if (passwordProperties.containsSpecialCharacter) {
    passwordMatchingCritera.push(getRandomSpecialChar());
  }
}

function pushRemainingCharacters(passwordProperties, passwordMatchingCritera) {
  let fillerCount = passwordProperties.length - passwordMatchingCritera.length;
  for (let i = 1; i <= fillerCount; i++) {
    //This is the predfined order of priority that we have hard coded. This can further be randomized
    if (passwordProperties.containsLowerCase) {
      passwordMatchingCritera.push(getRandomLowerCaseChar());
    } else if (passwordProperties.containsUpperCase) {
      passwordMatchingCritera.push(getRandomUpperCaseChar());
    } else if (passwordProperties.containsNumber) {
      passwordMatchingCritera.push(getRandomNumber());
    } else if (passwordProperties.containsSpecialCharacter) {
      passwordMatchingCritera.push(getRandomSpecialChar());
    }
  }
}

function getRandomSpecialChar() {
  return passwordSpecialChars[genreateRandomNumber(7)];
}

function getRandomNumber() {
  return numberchars[genreateRandomNumber(9)];
}

function getRandomUpperCaseChar() {
  return upperCaseChars[genreateRandomNumber(25)];
}

function getRandomLowerCaseChar() {
  return lowerCaseChars[genreateRandomNumber(25)];
}

/**
 * Generate a random number from 0 to @param max.
 * @param {*} max
 */
function genreateRandomNumber(max) {
  return Math.floor(Math.random() * max);
}
