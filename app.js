const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const session = require('express-session');


const saltRounds = 10;

const port = process.env.PORT || 3000;

require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser());
app.use(expressValidator());


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));

app.get('/register', (req, res) => {
  res.render('register', {
    title: "Registration Information"
  });
});


app.post('/register', (req, res) => {

  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
  req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
  req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password); // Additional validation to ensure username is alphanumeric with underscores and dashes
  req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

  const errors = req.validationErrors();

  if (errors) {
    console.log(`errors ${JSON.stringify(errors)}`);
    res.render('register', {
      title: 'Registration Error',
      errors: errors
    });
  } else {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    const db = require('./db.js');

    bcrypt.hash(password, saltRounds, function(err, hash) {
      db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hash], function(error, results, fields) {
        if (error) throw error;
        res.render("register", {
          title: "Registration Complete"
        });
      });
    });

  }
});
console.log("hi");
app.get('/test', (req, res) => {
  console.log("test");
});

app.listen(port, () => {
  console.log('Server started on port ' + port);
});