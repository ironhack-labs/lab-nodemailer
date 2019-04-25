![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Sign up Confirmation Email


## Introduction

![image](https://user-images.githubusercontent.com/23629340/37091320-032a2cb0-2208-11e8-8b73-27060f1960c3.png)

Almost every time we register on a web app, we have to confirm our account by clicking on a link that's been sent to our email. This is a great way to avoid registering users with fake info. In this lab, we will do the same exact thing - create app that will allow users to signup but their status will be by default set to `Pending Confirmation` and after they get the email verification code to their email and respond to it, their status will be changed to `active`. We will use **Nodemailer** for this!


## Requirements

- Fork this repo
- Then clone this repo


## Submission

- Upon completion, run the following commands:
```
$ git add .
$ git commit -m "done"
$ git push origin master
```
- Create Pull Request so your TAs can check up your work.


## Instructions


### Our gift 🎁 - Auth Flag

The `irongenerator` is pretty awesome, and with this new feature, you will love it even more. When running the `irongenerate nameOfYourProject` command on the terminal, you get a pretty cool express application ready to start working, but if you add the `--auth` flag, you will get the same application with PassportJS's `signup` and `login`  already set up.

So inside the folder you just cloned, go ahead and run the following command:

```bash
$ irongenerate lab-nodemailer --auth
$ cd lab-nodemailer
$ npm install
```

Awesome huh? Let's start!


### Iteration 1 - User Model

First, we need to modify the `User` model. Inside the `models` folder, you will find a `user.js` file. We already have the `username` and `password` fields, so we need to add the followings:

- **`status`** - will be a string, and you should add an `enum` because the only possible values are: *"Pending Confirmation"* or *"Active"*. By default, when a new user is created, it will be set to *"Pending Confirmation"*.
- **`confirmationCode`** - here we will store a confirmation code; it will be unique for each user.
- **`email`** - the user will complete the signup form with the email they will use to confirm the account.


### Iteration 2 - Signup Process

#### Adding the new fields

On the `auth/signup.hbs` file you need to add an `input` tag for the **email**. When the user clicks on the `signup` button, you should store the following values in the database:

- **username** - from the `req.body`;
- **password** - after hashing the value of the `password` field from the `req.body`;
- **email** - from the `req.body`;
- **confirmationCode** - for creating a confirmation code, you can use any methodology, from installing the npm package for email verification to simplest `Math.random()` function on some string.

Example: 
```js
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}
```

Now, you have to store the token in the `confirmationCode` field.

#### Sending the email

After creating the user, you should send the email to the address the user put on the `email` field. Remember to use **Nodemailer** for this. You should include the following URL in the email:

`http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER`

### Iteration 3 - Confirmation Route

When the user clicks on the URL we included in the email, we should make a comparison of the `confirmationCode` on the URL and the one in the database. You should create a route: `/confirm/:confirmCode` inside the `routes/auth.js` file.

Inside the route, after comparing the confirmation code, you have to set the `status` field of the user to 'Active'. Then render a `confirmation.hbs` view, letting the user know that everything went perfect, or showing the error.

### Iteration 4 - Profile View

Finally, you have to create a `profile.hbs` view, where you have to render the `username` and the `status` of the user.


### Bonus! Styling the Email

Sending the email that contains only the URL is super boring! Feel free to style it better.

![image](https://user-images.githubusercontent.com/23629340/37099024-ab0d7c9a-221f-11e8-9458-49f813437e2c.png)

Happy Coding! :heart:
