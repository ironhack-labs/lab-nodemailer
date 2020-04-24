router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;

  if (username === '' || password === '')
    return res.render('auth/signup', { message: 'Indicate username and password' });
  User.findOne({ $or: [{ username }, { email }] }, 'username', (err, user) => {
    if (user !== null)
      return res.render('auth/signup', { message: 'The username or email already exists' });

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: confirmationCodeGen(),
    });

    newUser
      .save()
      .then(usr => res.redirect('/'))
      .catch(err => res.render('auth/signup', { message: 'Something went wrong, try again' }));
  });
});
