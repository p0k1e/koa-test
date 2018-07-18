const Koa = require('koa'); // core
const bodyParser = require('koa-bodyparser'); // POST parser
const serve = require('koa-static'); // serves static files like index.html
const logger = require('koa-logger'); // optional module for logging

const passport = require('./passport'); //passport for Koa
const router = require('./router');

const CONFIG = require('./config');

const app = new Koa();

app
  .use(serve('./public'))
  .use(logger())
  .use(bodyParser())
  .use(passport.initialize())
  .use(router.routes());

const server = app.listen(CONFIG.port)