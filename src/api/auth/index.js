const Router = require('@koa/router');
const auth = new Router();
const authCtrl = require('./auth.controller');

// 결과 값들 ctx.body 말고 응답만 받을 것
auth.post('/register', authCtrl.register);
auth.post('/login/:value', authCtrl.login); // 변수 value는 email 값
// auth.post('/login', authCtrl.login); // 변수 value는 email 값
auth.get('/exists/:key(friends|nickname|email)/:value', authCtrl.exists);
// key 라는 파라미터를 설정하는데, 이 값들이 friendsname 이나 nickname 일때만 허용한다는 것 입니다.
// friendsname 계속 true만 반환해서 nickname의 {!반환값} 사용
auth.post('/delete_user', authCtrl.delete_user);
auth.get('/update_thumbnail/:email/:thumbnail', authCtrl.updateThumbnail);


module.exports = auth;