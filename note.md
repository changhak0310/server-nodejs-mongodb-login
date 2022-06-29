auth/check 에서 get할시 auth.profile 보이게
정규식
아케텍처 정리
TDD
VNC하기

check API 만들기
이제, 만약에 쿠키에 access_token 이 있다면, 현재 로그인된 유저의 정보를 알려주는 API 를 만들어보겠습니다.

src/api/auth/auth.controller.js - check
exports.check = (ctx) => {
    const { user } = ctx.request;

    if(!user) {
        ctx.status = 403; // Forbidden
        return;
    }

    ctx.body = user.profile;
};
이렇게, ctx.request.user 에 접근하면 토큰에 설정했던 객체값을 얻을 수 있습니다. 이제 라우트를 설정을 하겠습니다.

src/api/auth/index.js
const Router = require('koa-router');
const auth = new Router();
const authCtrl = require('./auth.controller');

auth.post('/register/local', authCtrl.localRegister);
auth.post('/login/local', authCtrl.localLogin);
auth.get('/exists/:key(email|username)/:value', authCtrl.exists);
auth.post('/logout', authCtrl.logout);
auth.get('/check', authCtrl.check);

module.exports = auth;
여기까지 구현을 하고 나서, 로그인 API 를 통해 토큰을 쿠키에 설정받은 다음에, http://localhost:4000/api/auth/check 에 GET 요청을 하면 해당 토큰이 가지고 있는 회원정보를 반환 하게 됩니다.

GET http://localhost:4000/api/auth/check

{
    "thumbnail": "/static/images/default_thumbnail.png",
    "username": "velopert"
}
이제 회원인증을 위한 API 준비를 어느정도 마쳤습니다. 다음 5장 부터 프론트엔드 작업을 시작해보도록 하겠습니다.