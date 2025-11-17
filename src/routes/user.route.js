const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const permissions = require('../utils/permissions');

router.post('/signup/:userMov', user.signUp);
router.post('/login', user.login);
router.post('/choose-branch', user.chooseBranch);
router.post('/leave-branch', user.leaveBranch);
router.post('/can-i/:action', user.canI);
router.patch('/patch-can-i/:authorizationId', user.patchCanI);
router.put('/updated/:id/:userMov', permissions.isLoggedIn, user.updateUser);
router.put('/changePassword/:id', permissions.isLoggedIn, user.changePassword);
router.put('/delete/:id/:user', permissions.isLoggedIn, user.deleteUser);
router.get('/all', permissions.isLoggedIn, permissions.firstLevel,  user.getUsers);
router.get('/all-self', permissions.isLoggedIn, permissions.firstLevel, user.getAllUserEvenSelf);
router.get('/self-zone/:zona', permissions.isLoggedIn, permissions.firstLevel, user.getUserSelfByZone);
router.get('/all-with-logged', permissions.isLoggedIn, permissions.firstLevel,  user.getAllUsers);
router.get('/one/:id', permissions.isLoggedIn, permissions.firstLevel, user.getUser);
router.get('/verify', permissions.isLoggedIn, user.verify);
router.get('/zone/:zone', permissions.isLoggedIn, user.getUsersZone);
router.get('/zone-branch-man/:zone', permissions.isLoggedIn, user.getUsersZoneWithBranchManager);
router.post('/update-credentials/:id', permissions.isLoggedIn, user.updateCredentials);

//indentities admin
router.get('/get-data-user/:id', user.getUserDataByUsername); //encontrar todo el usuario
router.get('/findUser/:username', user.getUserByUsername); //encontrar id
router.get('/findZone/:username', user.getZoneByUsername);
router.get('/validate-identity-adm/:user', user.validateIdentityAdm);
router.post('/set-identity-adm', user.setIdentityAdm);
router.delete('/close-identity-adm/:identity', user.closeIdentityAdm);
router.get('/delete-identity-adm/:user', user.deleteIdentityAdm);
router.delete('/delete-one-identity/:identity', user.deleteOneIdentityAdm);
router.get('/get-identities-adm/:user', user.getIdentitiesAdm)
router.get('/find-number-identities/:identity', user.findNumberIdentities)

module.exports = router;
