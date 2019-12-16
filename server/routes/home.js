const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.send('TO DO');
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
