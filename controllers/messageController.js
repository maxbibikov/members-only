const { check, validationResult } = require('express-validator');

// Models
const Message = require('../models/message');

exports.message_board_get = (req, res, next) => {
  if (req.user && (req.user.activeMember || req.user.role === 'admin')) {
    return Message.find({}, 'title text user date')
      .sort('-date')
      .populate('user', 'username')
      .exec()
      .then((messages) => {
        return res.render('index', { title: 'Club House', messages });
      })
      .catch((err) => next(err));
  }
  return Message.find({}, 'title text')
    .sort('-date')
    .exec()
    .then((messages) => {
      return res.render('index', { title: 'Club House', messages });
    })
    .catch((err) => next(err));
};

exports.add_message = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .isLength({ min: 3, max: 30 })
    .withMessage('Title length should be between 3 and 30 characters')
    .trim(),
  check('text')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .isLength({ min: 2, max: 300 })
    .withMessage('Message length should be between 2 and 300 characters')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { title, text } = req.body;

    if (!errors.isEmpty()) {
      return Message.find({})
        .sort('-date')
        .exec()
        .then((messages) => {
          return res.render('index', {
            title: 'Club House',
            title,
            text,
            messages,
            errors: errors.array(),
          });
        })
        .catch((err) => next(err));
    }

    const message = new Message({
      title,
      text,
      user: req.user.id,
      date: new Date().toUTCString(),
    });

    return message
      .save()
      .then((savedMessage) => res.redirect('/'))
      .catch((err) => next(err));
  },
];

exports.delete_message = (req, res, next) => {
  const messageID = req.params.id;

  if (!messageID) {
    const messageIDError = new Error('Parameter message id not found');
    return next(messageIDError);
  }
  return Message.findOneAndRemove({ _id: messageID })
    .exec()
    .then(() => res.redirect('/'))
    .catch((err) => next(err));
};
