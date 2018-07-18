const Router = require('koa-router'); // routing
const passport = require('../passport');
const jwt = require('jsonwebtoken'); // auth via JWT for hhtp
const User = require('../models/User');

const CONFIG = require('../config');

const router = new Router();

router.post('/user', async(ctx, next) => {
  try {
    ctx.body = await User.create(ctx.request.body);
  }
  catch (err) {
    ctx.status = 400;
    ctx.body = err;
  }
});

// local auth route. Creates JWT is successful

router.post('/login', async(ctx, next) => {
  console.info('@@ CTX: ', ctx.request.body)
  await passport.authenticate('local', function (err, user) {
    if (user == false) {
      ctx.body = "Login failed";
    } else {
      //--payload - info to put in the JWT
      const payload = {
        id: user.id,
        displayName: user.displayName,
        email: user.email
      };
      const token = jwt.sign(payload, CONFIG.jwtsecret); //JWT is created here

      ctx.body = {user: user.displayName, token: 'JWT ' + token};
    }
  })(ctx, next);

});

// JWT auth route

router.get('/hello', async(ctx, next) => {
  await passport.authenticate('jwt', function (err, user) {
    if (user) {
      ctx.body = "hello " + user.displayName;
    } else {
      ctx.body = "No such user";
      console.log("err", err)
    }
  } )(ctx, next)

});

module.exports = router;