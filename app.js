require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

// Models
const User = require('./models/user');

// Router
const indexRouter = require('./routes/index');

const mongoDBUrl = process.env.DB_URL || process.env.DB_URL_DEV;

mongoose.connect(mongoDBUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongoDB connection error'));

passport.use(
  new LocalStrategy((username, password, done) => {
    return User.findOne({ username })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: `User ${username} not registered`,
          });
        }

        return user
          .validatePassword(password)
          .then((passwordIsValid) => {
            if (!passwordIsValid) {
              return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  })
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser((id, done) => {
  return User.findOne({ _id: id })
    .then((user) =>
      done(null, {
        username: user.username,
        id: user._id,
        fullname: user.fullname,
      })
    )
    .catch((err) => done(err));
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: db,
    }),
    resave: true,
    saveUninitialized: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
