const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth');

router.post('/signin', AuthController.sigin);
router.post('/logout', AuthController.logout);

module.exports = router;
