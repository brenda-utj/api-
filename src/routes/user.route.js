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

//indentities admin
router.get('/get-data-user/:id', user.getUserDataByUsername); //encontrar todo el usuario
router.get('/findUser/:username', user.getUserByUsername); //encontrar id
//router.get('/findZone/:username', user.getZoneByUsername);
router.get('/validate-identity-adm/:user', user.validateIdentityAdm);
router.post('/set-identity-adm', user.setIdentityAdm);
router.delete('/close-identity-adm/:identity', user.closeIdentityAdm);
router.get('/delete-identity-adm/:user', user.deleteIdentityAdm);
router.delete('/delete-one-identity/:identity', user.deleteOneIdentityAdm);
router.get('/get-identities-adm/:user', user.getIdentitiesAdm)
router.get('/find-number-identities/:identity', user.findNumberIdentities)


module.exports = router;
