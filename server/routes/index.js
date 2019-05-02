const Router = require('koa-router');
const {createReadStream} = require('fs');
const router = new Router();
const {getPoints, addPoint, deletePoint} = require('../lib/api');

router
    .get('/', async (ctx) => {
        ctx.type = 'html';
        ctx.body = createReadStream('index.html');
    })
    .get('/point', getPoints)
    .post('/point', addPoint)
    .post('/delpoint', deletePoint);

module.exports.routes = () => router.routes();
module.exports.allowedMethods = () => router.allowedMethods();
