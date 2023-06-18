// .env 파일에서 환경변수 불러오기
require('dotenv').config({ path: '../.env' });


const Koa = require('koa');
const Router = require('@koa/router');


const app = new Koa();
const router = new Router();
const api = require('./api');


const mongoose = require('mongoose');
// POST/PUT 등의 메소드의 Request Body 에 JSON 형식으로 데이터를 넣어주면 이를 파싱해서 서버측에서 사용
const bodyParser = require('koa-bodyparser'); 

mongoose.set("strictQuery", false);

mongoose.Promise = global.Promise; // Node의 네이티브 Promise 사용
// mongoDB연결
const uri = process.env.MONGO_URI || 'test_uri'
mongoose.connect(uri, {
    // useMongoClient: true,
    usenewurlparser: true,
    useunifiedtopology: true,
}).then(
    (response) => {
        console.log('Successfully connected to mongoDB');
    }
).catch(e => {
    console.error(e);
});


const port = process.env.PORT || 4001;


// router.get('/', (ctx, next) => {
//     ctx.body = '홈';
// });

// router.get('/about', (ctx, next) => {
//     ctx.body = '소개';
// });

// router.get('/about/:name', (ctx, next) => {
//     const { name } = ctx.params; // 라우트 경로에서 :파라미터명 으로 정의된 값이 ctx.params 안에 설정됩니다.
//     ctx.body = name + '의 소개';
// });

// router.get('/post', (ctx, next) => {
//     const { id } = ctx.request.query; // 주소 뒤에 ?id=10 이런식으로 작성된 쿼리는 ctx.request.query 에 파싱됩니다.
//     if(id) {
//         ctx.body = '포스트 #' + id;
//     } else {
//         ctx.body = '포스트 아이디가 없습니다.';
//     }
// });


app.use(bodyParser()); // 바디파서 적용, 라우터 적용코드보다 상단에 있어야합니다.

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port, () => {
    console.log(`koa api server is listening to port ${port}`);
});



// const crypto = require('crypto');
// const password = 'abc123';
// const secret = 'mySecretKey123!@#'
// const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');
// console.log(hashed);