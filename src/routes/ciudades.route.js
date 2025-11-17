const express = require('express');
const router = express.Router();
const ciudades = require('../controllers/ciudades.controller');
const permissions = require('../utils/permissions');

//create
router.post('/new-city', permissions.isLoggedIn, ciudades.createCity);
router.post('/new-state', permissions.isLoggedIn, ciudades.createState);
router.post('/new-country', permissions.isLoggedIn, ciudades.createCountry);

//edit
router.post('/edit-city/:id', permissions.isLoggedIn, ciudades.editCity);
router.post('/edit-state/:id', permissions.isLoggedIn, ciudades.editState);
router.post('/edit-country/:id', permissions.isLoggedIn, ciudades.editCountry);

//delete
router.post('/delete-city/:id', permissions.isLoggedIn, ciudades.deleteCity);
router.post('/delete-state/:id', permissions.isLoggedIn, ciudades.deleteState);
router.post('/delete-country/:id', permissions.isLoggedIn, ciudades.deleteCountry);

//get by
router.get('/get-states-country/:id', permissions.isLoggedIn, ciudades.getStatesByCountry);
router.get('/get-cities-state/:id', permissions.isLoggedIn, ciudades.getCitiesByState);

//get all
router.get('/get-countries', permissions.isLoggedIn, ciudades.getAllCountries);
router.get('/get-states', permissions.isLoggedIn, ciudades.getAllStates);
router.get('/get-cities', permissions.isLoggedIn, ciudades.getAllCities);

module.exports = router;