const express = require('express');
const router = express.Router();

const about = require('./about.js');
const post = require('./post.js');
const auth = require('./auth.js');

router.get('/', function(req, res, next) {
    res.send('home');
});

router.use('/auth', auth);
router.use('/about', about);
router.use('/post', post);

module.exports = router;