const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.post('/register', UserController.register);
router.get('/:userId/:uuid/active', UserController.activeUser);
router.get('/:userId/active/resend', UserController.resendActiveEmail);

module.exports = router;
