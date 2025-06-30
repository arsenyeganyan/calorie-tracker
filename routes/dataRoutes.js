const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');

router.get('/getUserData', DataController.getUserData);
router.post('/addToDay', DataController.addToDay);
router.get('/getDayData', DataController.getDayData);
router.get('/getAllUserDays', DataController.getAllUserDays);

module.exports = router;