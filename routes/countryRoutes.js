const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

router.get('/', countryController.getAllCountries);

router.get('/:id', countryController.getCountryById);

router.get('/:id/neighbour', countryController.getCountryNeighbours);

module.exports = router;

