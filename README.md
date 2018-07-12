![Ironhack logo](https://i.imgur.com/1QgrNNw.png)

# PP | Sign up Confirmation Email

## Requirements

- [Fork this repo](https://guides.github.com/activities/forking/).
- Clone your fork into your `~/code/labs` folder.

## Submission

Upon completion, run the following commands:

```bash
$ git add .
$ git commit -m"done"
$ git push origin master
```

Navigate to your repo and create a Pull Request -from your master branch to the original repository master branch.

In the Pull Request name, add your Campus, name, and last name separated by a dash "-".

## Introduction

![image](https://user-images.githubusercontent.com/23629340/37091320-032a2cb0-2208-11e8-8b73-27060f1960c3.png)

Almost every time we register on a web app, the platform asks us to confirm our account by clicking on a link they send to our email. This is a great way to avoid people who complete the registration with fake info. In this lab, we will create an application where a user can signup and then clicks on a link he will receive at our email. We will use **Nodemailer** for this!

### Our gift 🎁 - Auth Flag

The `ironhack_generator` is pretty awesome, and with this new feature, you will love it even more. When running the `irongenerate nameOfYourProject` command on the terminal you get a pretty cool express application ready to start working, but if you add the `--auth` flag, you will get the same application with PassportJS's `signup` and `login`  already set up.

So inside the folder you just clone, go ahead and run the following command:

```bash
$ irongenerate lab-nodemailer --auth
$ cd lab-nodemailer
$ npm install
```

Awesome huh? Let's start!

## Deliverables

### Iteration 1 - User Model

First, we need to modify the `User` model. Inside the `models` folder, you will find a `user.js` file. We already have the `username` and `password` fields, so we need to add the followings:

- **`status`**. Will be a string, and you should add an `enum` because the only possibles values are: *"Pending Confirmation"* or *"Active"*. By default, when a new user is created, it will be set to *"Pending Confirmation"*.
- **`confirmationCode`**. Here we will store a confirmation code you will attach to the URL. It will be unique for each user.
- **`email`**. The user will complete the signup form with the email they will use to confirm the account.


### Iteration 2 - Signup Process

#### Adding the new fields

On the `auth/signup.hbs` file you need to add an `input` tag for the **email**. When the user clicks on the `signup` button, you should store the following values in the database:

- **username**. From the `req.body`.
- **password**. After hashing the value of the `password` field from the `req.body`.
- **email**. From the `req.body`.
- **confirmationCode**. For creating a confirmation code, we will **hash** the `username` value, the same way we do with `password` field. After hashing the value, we store it on the `confirmationCode` value.

![image](https://user-images.githubusercontent.com/23629340/37097022-bcd833f2-221a-11e8-9dbc-f7eeb950b79d.png)

#### Sending the email

After creating the user, you should send the email to the address the user put on the `email` field. Remember to use **Nodemailer** for this. You should include the following URL in the email:

`http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER`

### Iteration 3 - Confirmation Route

When the user clicks on the URL we included in the email; we should make a comparison of the `comparationCode` on the URL and the one on the database. You should create a route: `/confirm/:confirmCode` inside the `routes/auth.js` file.

Inside the route, after comparing the confirmation code, you have to set to 'Active' the `status` field of the user, and then render a `confirmation.hbs` view, letting know to the user that everything goes perfect, or showing the error.

![image](https://user-images.githubusercontent.com/23629340/37097564-1113a5d6-221c-11e8-955a-87fa11b85ac0.png)

### Iteration 4 - Profile View

Finally, you have to create a `profile.hbs` view, where you have to render the `username` and the `status` of the user. 

<img src="https://user-images.githubusercontent.com/23629340/37097677-5e117c00-221c-11e8-9307-bb01aac96bb4.png" style="width:45%">

<img src="https://user-images.githubusercontent.com/23629340/37097698-6744d902-221c-11e8-90f1-b680f6dbdd76.png" style="width:45%">

### Bonus! Styling the Email

Sending the email, only with the URL is super boring! Feel free to give some sugar to the design, at the end is `HTML`.

![image](https://user-images.githubusercontent.com/23629340/37099024-ab0d7c9a-221f-11e8-9458-49f813437e2c.png)

