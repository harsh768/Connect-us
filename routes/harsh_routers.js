const express = require('express');
const router = express.Router();

const harshController = require('../controllers/harsh_controller');

router.use('/profile',harshController.profile);

module.exports = router;