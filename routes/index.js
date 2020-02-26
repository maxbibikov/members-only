const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.use((req, res, next) => {
  res.locals.user = req.user;
  return next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Club House', user: req.user });
});

router.get('/sign-up', userController.user_signup_get);
router.post('/sign-up', userController.user_signup_post);

router.get('/log-in', userController.user_login_get);
router.post('/log-in', userController.user_login_post);

router.get('/log-out', userController.user_logout_get);

router.get('/membership', userController.membership_get);
router.post('/membership', userController.membership_post);

module.exports = router;
