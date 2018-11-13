const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { normalizeErrors } = require('../helpers/mongoose');
const config = require('../config');

// display User info
exports.getUser = function(req, res) {
  const requestedUserId = req.params.id;
  const user = res.locals.user;

  if (requestedUserId === user.id) {
    // send all User info
    User.findById(requestedUserId, (err, foundUser) => {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(foundUser);
    });
  } else {
    // restricted User info
    User.findById(requestedUserId)
      //hiding attributes
      .select('-revenue -stripeCustomerId -password -email -_id')
      .exec((err, foundUser) => {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json(foundUser);
      });
  }
};

exports.auth = function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      errors: [
        {
          title: 'Data missing',
          detail: 'Provide email and password!'
        }
      ]
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (!user) {
      return res.status(422).send({
        errors: [
          {
            title: 'Invalid User',
            detail: 'User does not exist!'
          }
        ]
      });
    }

    // matching passwords
    if (user.hasSamePassword(password)) {
      // return jwt TOKEN
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username
        },
        config.SECRET,
        { expiresIn: '1h' }
      );
      return res.json(token);
    } else {
      return res.status(422).send({
        errors: [
          {
            title: 'Wrong Data!',
            detail: 'Wrong email or password!'
          }
        ]
      });
    }
  });
};

exports.register = function(req, res) {
  // destructurizing
  const { username, email, password, passwordConfirmation } = req.body;

  if (!username || !email || !password) {
    return res.status(422).send({
      errors: [
        {
          title: 'Data missing',
          detail: 'Provide username, email and password!'
        }
      ]
    });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({
      errors: [
        {
          title: 'Invalid password',
          detail: 'Password is not a same as a confirmation!'
        }
      ]
    });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    if (existingUser) {
      return res.status(422).send({
        errors: [
          {
            title: 'Invalid email',
            detail: 'User with the same email already exists!'
          }
        ]
      });
    }

    const user = new User({
      username,
      email,
      password
    });

    user.save(err => {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json({ registered: true });
    });
  });
};

// middlewear to protect routes
exports.authMiddlewear = function(req, res, next) {
  // get token from headers
  const token = req.headers.authorization;

  if (token) {
    // get user info from token
    const user = parseToken(token);
    User.findById(user.userId, function(err, user) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (user) {
        // save user to locals
        res.locals.user = user;
        next();
      } else {
        return notAuthorized(res);
      }
    });
  } else {
    return notAuthorized(res);
  }
};

// getting info by parsing our token (deleting 'Bearer')
function parseToken(token) {
  // let tokenWithoutBearer = token.split(' ')[1];
  return jwt.verify(token.split(' ')[1], config.SECRET);
}

// error handler func for not authorized users
function notAuthorized(res) {
  return res.status(401).send({
    errors: [
      {
        title: 'Not aurthorized',
        detail: 'You need to login to get access!'
      }
    ]
  });
}
