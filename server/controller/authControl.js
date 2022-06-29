const Author = require('../models/accountModel');

// 로컬 회원가입
exports.localRegister = async (req, res) => {
    //값 받아오기
    var auth = new Author(req.body);
    
    const { 
        profile:{
            username
        },
        email,
        password 
    } = auth;

    console.log("들어온 값 - username : " + username + ", email : " + email + ", password : " + password);
    //값 받아오기

    //서버 로그인 정규식 설정하기
    //서버 로그인 정규식 설정하기

    //아이디/이메일 중복 처리
    var existing = null;
    try{
        existing = await Author.findByEmailOrUsername(username, email);
    } catch (err) {
        console.log(err);
        throw (err);
    }

    if(existing) {
        res.send("이메일 중복");
        return;
    }
    //아이디/이메일 중복 처리

    //계정 생성
    var account = null;
    try {
        account = await Author.localRegister(username, email, password);
    } catch (err) {
        console.log(err);
        throw(err);
    }
    console.log(account.profile)
    //계정 생성

    //토큰생성
    var token = null;
    try {
        token = await auth.generateToken();
        //console.log(token);
    } catch(err) {
        console.log(err);
        throw(err);
    }
    //토큰생성

    //쿠키 넣기
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge:  10 * 60 * 1000
    })
    //쿠키 넣기
    
    res.send(account.profile);
}

// 로컬 로그인
exports.localLogin = async (req, res) => {
    const auth = new Author(req.body);

    const {
        email,
        password,
    } = auth;

    //계정 찾기
    var account = null;
    try {
        //이메일로 계정 찾기
        account = await Author.findByEmail(email);
    } catch (err){
        console.log(err);
        throw(err);
    }
    //계정 찾기

    console.log("로그인 한 계정 : " + account);

    //유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면
    if((account === null) || !(auth.validatePassword(password, account))) {
        console.log('유저가 없거나 비번이 일치하지 않음');
        return ;
    }
    //유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면

    //jwt토큰 생성
    var token = null;
    try {
        token = await account.generateToken();
    } catch (err) {
        console.log(err);
        throw(err);
    }
    //jwt토큰 생성

    //쿠키 넣기
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge:  10 * 60 * 1000
    })
    //쿠키 넣기

    res.send(account.profile);
}

// 이메일 / 아이디 존재유무 확인??
exports.exists = async (req, res) => {
    const auth = new Author(req.body);

    const {
        email,
        password,
    } = auth;

    var account = null;
    try {
        //account = await ( ) 
    } catch (err) {
        console.log(err);
        throw(err);
    }
}

// 로그아웃
exports.logout = async (req, res) => {
    //쿠키 빼기
    res.cookie('access_token', null, {
        httpOnly: true,
        maxAge:  0
    })
    //쿠키 빼기
    res.send('로그아웃 됨');
}

//쿠키에 access_token 이 있다면, 현재 로그인된 유저의 정보를 알려줌
exports.check = (req, res) => {
    const { user } = req;

    if(!user) {
        res.send('로그인 x');
        return;
    }

    res.send(user);
}