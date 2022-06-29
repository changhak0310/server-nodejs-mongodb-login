var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('about');
});

router.get('/:name', function(req, res){
    res.send(req.params.name + '의 소개')
})

module.exports = router;