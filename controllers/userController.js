const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Models
const User = require('../models/user.js');

exports.user_signup_get = (req, res) =>
  res.render('signup-form', { title: 'SignUp' });

exports.user_signup_post = [
  check('fullname')
    .notEmpty()
    .withMessage('Full Name should not be empty')
    .isLength({ min: 3, max: 60 })
    .withMessage('Full Name must be 3 to 60 characters long')
    .isString()
    .trim()
    .escape(),
  check('username')
    .isAlphanumeric()
    .withMessage('Username can contain only letters and numbers')
    .notEmpty()
    .withMessage('Username should not be empty')
    .isLength({ min: 2, max: 20 })
    .withMessage('Username must be 2 to 20 characters long')
    .isString()
    .trim()
    .escape()
    .blacklist(' '),
  check('password')
    .notEmpty()
    .withMessage('Password hould not be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .not()
    .isIn(['12345678', '01234567', 'password123', 'qwertyui', '111111111'])
    .withMessage('Your password is too easy to guess')
    .matches(/\d/)
    .withMessage('Password should contain number')
    .isString()
    .trim()
    .escape(),
  check('password_confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }

    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    const { fullname, username, password, admin } = req.body;

    if (!errors.isEmpty()) {
      return res.render('signup-form', {
        title: 'SignUp',
        fullname,
        username,
        errors: errors.array(),
      });
    }

    return bcrypt
      .genSalt(10)
      .then((salt) =>
        bcrypt
          .hash(password, salt)
          .then((hashedPass) => {
            const user = new User({
              fullname,
              username,
              password: hashedPass,
              role: admin ? 'admin' : 'user',
            });

            return user
              .save()
              .then((savedUser) => {
                return res.redirect('/');
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err))
      )
      .catch((err) => next(err));
  },
];

exports.user_login_get = (req, res) =>
  res.render('login-form', { title: 'Login' });
exports.user_login_post = [
  check('username', 'Username is not valid')
    .notEmpty()
    .isString()
    .trim()
    .escape(),
  check('password', 'Password is not valid')
    .notEmpty()
    .isString()
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { username } = req.body;

    if (!errors.isEmpty()) {
      return res.render('login-form', {
        title: 'Login',
        errors: errors.array(),
        username,
      });
    }
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.render('login-form', {
          title: 'Login',
          errors: [{ msg: info.message }],
        });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.redirect('/');
      });
    })(req, res, next);
  },
];

exports.user_logout_get = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.membership_get = (req, res) =>
  res.render('membership', { title: 'Membership' });
exports.membership_post = [
  check('secret_string', 'Secret string is not valid')
    .notEmpty()
    .isString()
    .equals('secret string')
    .withMessage('Wrong answer. Try again 👻'),
  (req, res, next) => {
    const errors = validationResult(req);
    const { secret_string } = req.body;

    if (!errors.isEmpty()) {
      return res.render('membership', {
        title: 'Membership',
        secret_string,
        errors: errors.array(),
      });
    }
    const currentDate = new Date();
    currentDate.setUTCDate(currentDate.getUTCDate() + 30);

    return User.findOneAndUpdate(
      { _id: req.user.id },
      {
        membership_end: currentDate.toUTCString(),
      }
    )
      .exec()
      .then((updatedUser) => {
        return res.redirect('/membership');
      })
      .catch((err) => next(err));
  },
];
