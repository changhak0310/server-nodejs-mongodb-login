
require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GenerateToken } = require('../middleware/mid_token');

// function hash(password) {   //crypto
//     return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
// }

function hash(password) {   //bcrypt
    return bcrypt.hashSync(password, 10)
}

const Account = new Schema({
    //   tokenExp: {
    //     type: Number,
    //   },
    profile: {
      username: String,
      thumbnail: { type: String, default: '/static/images/default_thumbnail.png' }
    },
    email: {
        type: String,
        //unique: 1,
    },
    // 소셜 계정으로 회원가입을 할 경우에는 각 서비스에서 제공되는 id 와 accessToken 을 저장합니다
    social: {
        facebook: {
            id: String,
            accessToken: String
        },
        google: {
            id: String,
            accessToken: String
        }
    },
    password: String, // 로컬계정의 경우엔 비밀번호를 해싱해서 저장합니다
    tokenExp : {
        type: Number,
    },
    thoughtCount: { type: Number, default: 0 }, // 서비스에서 포스트를 작성 할 때마다 1씩 올라갑니다
    createdAt: { type: Date, default: Date.now }
});


Account.statics.findByUsername = function(username) {
    return this.findOne({'profile.username': username}).exec();
}

Account.statics.findByEmail = function(email) {
     // 객체에 내장되어있는 값을 사용 할 때는 객체명.키 이런식으로 쿼리하면 됩니다
    return this.findOne({email}).exec();
};

Account.statics.findByEmailOrUsername = function({username, email}) {
    return this.findOne({
        // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
        $or: [
            { 'profile.username': username },
            { email }
        ]
    }).exec();
};

//비번 암호화
Account.statics.localRegister = function(username, email, password) {
    // 데이터를 생성 할 때는 new this() 를 사용합니다.
    const account = new this({
        profile: {
            username
            // thumbnail 값을 설정하지 않으면 기본값으로 설정됩니다.
        },
        email,
        password: hash(password)
    });
    return account.save();
};

Account.methods.validatePassword = function(password, auth) {
    // 함수로 전달받은 password 의 해시값과, 데이터에 담겨있는 해시값과 비교를 합니다.
    const encodedPassword = auth.password;

    const same = bcrypt.compareSync(password, encodedPassword);
    return same;
};

Account.methods.generateToken = function() {

    const payload = {
        _id: this._id,
        profile: this.profile
    }

    return GenerateToken(payload, 'account');
};

module.exports = mongoose.model('Account', Account)