const http = require('http');
const config = require('./config');
const Koa = require('koa');
const {routes, allowedMethods} = require('./routes');
const error = require('./middleware/error');
const mongoose = require('mongoose');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const serve = require('koa-static');
const app = new Koa();

const koaOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin"
};

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
mongoose.connection.on('connected', () => console.log('mongodb connected'));
mongoose.connection.on('error', () => console.log('mongodb error'));
mongoose.connection.on('disconnected', () => console.log('mongodb disconnected'));

app.use(cors(koaOptions));
app.use(serve('./public'));
app.use(koaBody());
app.use(routes());
app.use(allowedMethods());
app.use(error);
app.use(async (ctx) => {
    ctx.status(404);
    ctx.body = '<h1>404</h1><p>page not found</p>';
});


http.createServer(app.callback()).listen(config.get('port'), () => console.log(`server started on http://localhost:${config.get('port')}`));
