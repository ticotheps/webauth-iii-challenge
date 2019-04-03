const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');
const secret = require('../api/secrets').jwtSecret;

// allows a user to register a new credentials to be added to the database
router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 5);
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

// gives the user a valid token if the credentials provided match the credentials in the database
router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
  
          res.status(200).json({
            message: `Welcome ${user.username}!, have a token...`,
            token,
          });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

// generates a new token when a user logs in successfully
function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      department: ['instructors', 'project managers', 'students']
    };

    const options = {
      expiresIn: '1d',
    };
  
    return jwt.sign(payload, secret, options); // returns a valid token
  };
  
  module.exports = router;