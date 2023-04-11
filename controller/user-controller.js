const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const createToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 200 // 86400 expires in 24 hours
    });
}

exports.registerUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'You need to send email and password' });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ msg: 'The user already exists' });
        }

        const newUser = new User(req.body);
        const savedUser = await newUser.save();

        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};



exports.loginUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'You need to put email and password' });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'The user does not exist' });
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            return res.status(200).json({
                token: createToken(user)
            });
        } else {
            return res.status(400).json({ msg: 'The email and password dont match.' });
        }
        } catch (error) {
        return res.status(400).json({ msg: error });
        }
};


exports.logoutUser = (req, res) => {
    // Get the user's access and refresh tokens from the request headers
    const accessToken = req.headers.accesstoken;
    const refreshToken = req.headers.refreshtoken;
  
    // Invalidate the tokens by removing them from the database
    User.findOneAndUpdate({ accessToken, refreshToken }, { accessToken: null, refreshToken: null }, (err) => {
      if (err) {
        return res.status(500).send({ message: 'Error logging out' });
      }
      res.status(200).send({ message: 'Successfully logged out' });
    });
  };

