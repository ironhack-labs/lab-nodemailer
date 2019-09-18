const template = (token) => {
  return `

  <style>
    .container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: #F8F8F8;
      font-family: sans-serif;
    }

    .text {
      color: #888888;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .text-thanks {
      font-weight: 600;
    }

    .button-link {
      display: inline-block;
      padding: .5rem 1rem;
      border-radius: 3px;
      box-shadow: 0 3px 6px crimson;
      background-color: crimson;
      color: #FFFFFF;
    }
  </style>

  <div class="container">
    <h1 class="title">Verify your user</h1>
    <p class="text">We need you to verify your account so you can log in in our website.</p>
    <a class="button-link" href="http://localhost:3000/auth/confirm/${token}">Activate account</a>
    <p class="text text-thanks">Thank you.</p>
  </div>
  `
}
  