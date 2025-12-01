const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const permissions = require('../utils/permissions');

// AUTH
router.post('/signup', user.signUp);
router.post('/login', user.login);
router.post("/logout", permissions.isLoggedIn, user.logout);


// CRUD
router.get('/', user.getUsers);
router.get('/:id', user.getUser);
router.put('/:id', user.updateUser);
router.delete('/:id', user.deleteUser);

module.exports = router;
