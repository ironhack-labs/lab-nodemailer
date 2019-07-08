

document.addEventListener('DOMContentLoaded', () => {

  /////////////////ADDED BY ME
  document.getElementById("signUp").onsubmit = function(event) {
    event.preventDefault();
    let username = document.querySelector('.field input[name="username"]').value;
    let password = document.querySelector('.field input[name="password"]').value;
    let email = document.querySelector('.field input[name="email"]').value;
    let confirmationCode = document.querySelector('.field input[name="confirmationCode"]').value;

    userSchema.createOneUser({ username, password, email, confirmationCode });
  };
/////////////////

  console.log('IronGenerator JS imported successfully!');

}, false);
