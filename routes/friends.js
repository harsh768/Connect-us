const express = require('express');

const router = express.Router();
const friendsController = require('../controllers/friends_controller');


router.post('/togglefriend', friendsController.togglefriend);
router.get('/accept-request/:id',friendsController.acceptrequest);
router.get('/decline-request/:id',friendsController.declinerequest);

module.exports = router;