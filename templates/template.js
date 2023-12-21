function templateExample(username, confirmationCode) {
  // return `PASTE HTML CODE HERE AND USE ${username} VARIABLE WHERE YOU WANT``http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER`;
  return `<h2>Ironhack Confirmation Mail</h2>
  <h3>Hello ${username}</h3>
  <p>Thanks to join our community! Please confirm your accunt on the following link:</p>
  <p>http://localhost:3000/auth/confirm/${confirmationCode}</p>
  <h3>Great to see you creating awesome webpages you with us :)</h3>
  <p>You are doing awesome!</p>`;
}

module.exports = {
  templateExample,
};
