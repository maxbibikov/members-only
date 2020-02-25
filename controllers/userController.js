const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Models
const User = require('../models/user.js');

exports.user_signup_get = (req, res) => res.render('signup-form');
exports.user_signup_post = [
  check('fullname')
    .notEmpty()
    .withMessage('Should not be empty')
    .isLength({ min: 3, max: 60 })
    .withMessage('Must be from 3 to 60 characters long')
    .isString()
    .trim()
    .escape(),
  check('username')
    .notEmpty()
    .withMessage('Should not be empty')
    .isLength({ min: 2, max: 20 })
    .withMessage('Must be from 2 to 20 characters long')
    .isString()
    .trim()
    .escape(),
  check('password')
    .notEmpty()
    .withMessage('Should not be empty')
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters long')
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
    const { fullname, username, password } = req.body;

    if (!errors.isEmpty()) {
      return res.render('signup-form', {
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

exports.user_login_get = (req, res) => res.render('login-form');
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
        errors: errors.array(),
        username,
      });
    }
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.render('login-form', { errors: [{ msg: info.message }] });
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
