const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

/**
 * JWT 토큰 생성
 * @param {any} payload 
 * @returns {string} token
 */
function GenerateToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
            if(err) {
                //console.log(err);
                reject(err);
            } else {
                //console.log(token);
                resolve(token);
            }
        });
    })
};

/*
*토큰 확인
*/
function DecodeToken(token) {
    return new Promise(
        (resolve, reject) => {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if(err){
                    reject(err);
                } else {
                    //console.log(decoded)
                    resolve(decoded)
                }
            })
        }
    )
}

exports.JwtMiddleware = async (req, res, next) => {
    const token = req.cookies.access_token // access_token 을 읽어옵니다.

    if(!token) {
        //로그인이 안 되어 있을 시
        console.log('로그인 필요');
        return next();  // 토큰이 없으면 바로 다음 작업을 진행합니다.
    }

    try {
       const decoded = await DecodeToken(token);    // 토큰을 디코딩 합니다
       // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다
       if(Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
            // 하루가 지나면 갱신해준다.
            const { _id, profile } = decoded;
            const freshToken = await GenerateToken({ _id, profile }, 'account');
            res.cookie('access_token', freshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
                httpOnly: true
            });
        }
        // request.user 에 디코딩된 값을 넣어줍니다
        console.log('현재 계정 : ');
        console.log(decoded)
        // req(decoded);
    } catch (err)  {
        // token validate 실패
        console.log(err)
        //req.user(null);
    }
    return next();
}


exports.GenerateToken = GenerateToken;

