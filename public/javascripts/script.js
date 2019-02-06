document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

document.querySelector("#myButton").onclick = e => {
  e.preventDefault();
  axios
    .post("/auth/signup", {
      username: document.getElementById("username").value,
      password: document.querySelector("#password").value,
      email: document.querySelector("#email").value
    })
    .then(() => {});
};
