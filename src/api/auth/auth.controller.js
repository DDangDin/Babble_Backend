const Joi = require('joi');
const Account = require('../../models/Account');

// 회원가입
// 데이터 검증은 안드로이드 스튜디오에서..!!!
exports.register = async (ctx) => { // 전화번호도 검사!!
     // 닉네임 / 이메일 중복 체크
     let existing = null;
     try {
         existing = await Account.findDataForRegister(ctx.request.body);
     } catch (e) {
         ctx.throw(500, e);
     }
 
     if(existing) {
     // 중복되는 닉네임/이메일이 있을 경우
         ctx.status = 409; // Conflict
         // 어떤 값이 중복되었는지 알려줌
         ctx.body = { // existing.profile 경로 신중
             key: existing.profile.email === ctx.request.body.email ? 'email' : 'nickname or phoneNumber',
             error: "이미 가입 된 계정입니다"
         };
         return;
     }

    // 계정 생성
    let account = null;
    try {
        account = await Account.register(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }

    // ctx.throw(400, "Hello World Error", errorProperties);

    // var jsonType = mime.lookup('json');
    // ctx.response.set("content-type", jsonType);
    // ctx.body = JSON.stringify(account.profile); // 프로필 정보로 응답합니다.
    
    ctx.body = account.profile; // 프로필 정보로 응답합니다.
    
};


// 로그인
exports.login = async (ctx) => {
    // 데이터 검증 (검증은 안드로이드 스튜디오에서 해도 될듯 아마??!)
    // const schema = Joi.object().keys({
    //     email: Joi.string().email().required(),
    //     nickname: Joi.string().required()
    // });

    // const result = Joi.validate(ctx.request.body, schema);

    // if(result.error) {
    //     ctx.status = 400; // Bad Request
    //     return;
    // }


    const { value } = ctx.params;
    let account = null;

    try{
        // 이메일로 계정 찾기
        account = await Account.findByEmail(value);
    } catch (e) {
        ctx.throw(500, e);
    }

    if (!account) {
        // 유저가 존재하지 않거나 || 닉네임이 일치하지 않으면
            ctx.status = 403; // Forbidden
            ctx.body = {
                error: "Account doesn't exist"
            };
            return;
        }
    
        ctx.body = account.profile;

};



exports.exists = async (ctx) => {
    const { key, value } = ctx.params;
    let account = null;

    try {
        // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
        // account = await (key === 'nickname' ? Account.findByNickName(value) : Account.findByFriendsName(value));
        switch(key){
            case 'nickname':
                account = await Account.findByNickName(value);
                break;
            case 'friendsname':
                account = await Account.findByFriendsName(value);
                break;
            case 'email':
                account = await Account.findByEmail(value);
                break;
        }
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.body = {
        isExist: account !== null
    };
};


// 로그아웃
exports.delete_user = async (ctx) => {
    ctx.body = 'delete_user';
};
