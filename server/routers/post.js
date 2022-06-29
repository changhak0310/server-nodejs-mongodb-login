const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const {id} = req.query;
    if(id) {
        res.send(id);
    } else {
        res.send('아이디 없음');
    }
  });

module.exports = router;