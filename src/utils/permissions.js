const jwt = require('jsonwebtoken');
const keys = require('./keys');
const User = require('../models/user.model');

module.exports = {
  isLoggedIn: async (req, res, next) => {
    if (req.headers.token === undefined || req.headers.token === null) {
      res.status(403).end();
    } else {
      try {
        const decoded = await jwt.verify(req.headers.token, keys.secret);
        const user = await User.findOne({_id: decoded._id});
        if (user) {
          req.user = user;
          next();
        } else {
          res.json('There is not a user with this token');
        }
      } catch (error) {
        res.status(500).json(error.message);
      }
    }
  },
  firstLevel: async (req, res, next) => {
    if (req.user.role === 'encargado de sucursal' ||
        req.user.role === 'rh de zona' ||
        req.user.role === 'supervisor' ||
        req.user.role === 'gerente' ||
        req.user.role === 'auxiliar de zona' ||
        req.user.role === 'administrativo' ||
        req.user.role === 'super administrativo') {
          next();
    } else {
      res.status(403).end();
    }
  },
  secondLevel: async (req, res, next) => {
    if (req.user.role === 'gerente' ||
    req.user.role === 'auxiliar de zona' ||
    req.user.role === 'administrativo' ||
    req.user.role === 'super administrativo') {
      next();
    } else {
      res.status(403).end();
    }
  },
  thirdLevel: async (req, res, next) => {
    if (req.user.role === 'auxiliar de zona' ||
    req.user.role === 'administrativo' ||
    req.user.role === 'super administrativo') {
      next();
    } else {
      res.status(403).end();
    }
  },
  fourthLevel: async (req, res, next) => {
    if (req.user.role === 'administrativo' ||
    req.user.role === 'super administrativo') {
      next();
    } else {
      res.status(403).end();
    }
  },
  fifthLevel: async (req, res, next) => {
    if (req.user.role === 'super administrativo') {
      next();
    } else {
      res.status(403).end();
    }
  },
  sixthLevel: async (req, res, next) => {
    if (req.user.role === 'rh de zona' ||
    req.user.role === 'super administrativo') {
      next();
    } else {
      res.status(403).end();
    }
  },
  
};
