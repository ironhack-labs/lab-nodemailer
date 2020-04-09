document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


function recaptchaCallback() {
  document.querySelector('.submitBtn').removeAttribute('disabled');
};