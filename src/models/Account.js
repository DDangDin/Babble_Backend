const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');


function hash(password) { // 서비스에 비밀번호 입력란이 없으므로 일단 생략
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
}


const Account = new Schema({
    profile: {
        username: String,
        nickname: String,
        email: { type: String },
        age: { type: Number, default: 0 },
        gender: { type: String, default: 'N' },
        phoneNumber: String,
        friends: [{
            id: { type: String },
            nickname: { type: String },
            age: { type: Number },
            city: { type: String },
            thumbnail: { type: String, default: '' }
        }],
        thumbnail: { type: String, default: '' }
    },
    // 소셜 계정으로 회원가입을 할 경우에는 각 서비스에서 제공되는 id 와 accessToken 을 저장합니다
    // social: {
    //     google: {
    //         id: String,
    //         accessToken: String
    //     }
    // },
    // wishCount: { type: Number, default: 0 }, // 서비스에서 포스트를 작성 할 때마다 1씩 올라갑니다
    // createdAt: { type: Date, default: Date.now }
});

Account.statics.updateThumnailByEmail = function(email, thumbnail) {
    // 객체에 내장되어있는 값을 사용 할 때는 '객체명.키' 이런식으로 쿼리하면 됩니다
    return this.updateOne({'profile.email' : email}, { $set: {'profile.thumbnail' : thumbnail} })
}

Account.statics.findByUsername = function(username) {
    // 객체에 내장되어있는 값을 사용 할 때는 '객체명.키' 이런식으로 쿼리하면 됩니다
    return this.findOne({'profile.username': username}).exec();
};

// 필요에 의해 성별, 나이, 추천인도 함수 생성

Account.statics.findByEmail = function(email) {
    // return this.findOne({email}).exec(); // profile 밖에 있을때는 그냥 email로 호출 됨
    return this.findOne({'profile.email': email}).exec();
};

Account.statics.findByNickName = function(nickname) {
    return this.findOne({'profile.nickname': nickname}).exec();
};

Account.statics.findByFriendsName = function(friendsName) { // 계속 true만 반환하는 듯
    return this.findOne({'profile.friendsName': friendsName}).exec();
};

Account.statics.findDataForRegister = function({nickname, email, phoneNumber}) {
    return this.findOne({
        // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
        $or: [
            {'profile.nickname': nickname},
            {'profile.email': email},
            {'profile.phoneNumber': phoneNumber}
        ]
    }).exec();
};

Account.statics.findDataForLogin = function({username, email}) {
    return this.findOne({
        // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
        $and: [
            {'profile.username': username},
            {'profile.email': email}
        ]
    }).exec();
};

// Account.statics.findByUsersData = function({username, email, phoneNumber}) { // For Register
//     return this.findOne({
//         // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
//         $and: [
//             {'profile.username': username},
//             {'profile.email': email},
//             {'profile.phoneNumber': phoneNumber}
//         ]
//     }).exec();
// };

Account.statics.register = function(
    { username, nickname, email, age, gender, phoneNumber, friends, thumbnail}) {
    // 데이터를 생성 할 때는 new this() 를 사용합니다.
    const account = new this({
        profile: {
            username,
            nickname,
            email,
            age,
            gender,
            phoneNumber,
            friends,
            thumbnail
            // thumbnail 값을 설정하지 않으면 기본값으로 설정됩니다.
        },
        // password: hash(password)
    });

    //.save() 함수를 실행하면 이 때 데이터베이스에 실제로 데이터를 작성합니다.
    // Promise 를 반환합니다.
    return account.save();
};

Account.methods.validatePassword = function(password) {
    // 함수로 전달받은 password 의 해시값과, 데이터에 담겨있는 해시값과 비교를 합니다.
    const hashed = hash(password);
    return this.password === hashed;
};


module.exports = mongoose.model('Account', Account);