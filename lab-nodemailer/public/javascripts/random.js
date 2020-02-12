// function confirmationCode() {
//   const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   let token = '';
//   for (let i = 0; i < 25; i++) {
//     token += characters[Math.floor(Math.random() * characters.length)];
//   }
//   return token;
// }

// document.getElementById('btn-token').onload = () => {
//   let token = confirmationCode();
//   console.log(token)
//   document.getElementById('confirmationCode').value = token
// }