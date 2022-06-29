const express = require('express');
const router = express.Router();
const authCtrl = require('../controller/authControl');

//회원가입
router.post('/register/local', authCtrl.localRegister);
//로그인
router.post('/login/local', authCtrl.localLogin);
//이메일/아이디 중복확인
router.get('/exists/:key(email|username)/:value', authCtrl.exists);
//로그아웃
router.post('/logout', authCtrl.logout);
//토큰 확인
router.get('/check', authCtrl.check);
  
module.exports = router;