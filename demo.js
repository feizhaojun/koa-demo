const Koa = require('koa');
const fs = require('fs');
const fsp = require('fs.promised');
const path = require('path');
const route = require('koa-route');
const serve = require('koa-static');
const compose = require('koa-compose');

const app = new Koa();
app.listen(3000);

// // 错误处理
// const main = ctx => {
//   ctx.throw(500);
// }
// app.use(main);

// Routes
const index = ctx => {
  // ctx.response.status = 404;
  // console.log(ctx.cookies.get('X-HC-TOKEN'));
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./html/index.html');
};

const about = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = '<h1>About</h1><a href="/">Index</a>';
};

// 同步函数
const asyncDemo = async function (ctx, next) {
  ctx.response.type = 'html';
  ctx.response.body = await fsp.readFile('./html/index.html', 'utf-8');
};

// 重定向
const redirect = ctx => {
  ctx.response.redirect('/');
};

// Static
// TODO: serve 是否接受通配符参数?
// TODO: 不能放在 logger 后面?
const serveDemo = serve(path.join(__dirname));
app.use(serveDemo);

// Middleware
const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.method} ${ctx.request.url}`);
  next(); // TODO:
}
app.use(logger);

// const middlewares = compose([logger, main]);
// app.use(middlewares);

// const one = (ctx, next) => {
//   console.log('>> 1');
//   next();
//   console.log('<< 1');
// }
// const two = (ctx, next) => {
//   console.log('>> 2');
//   next(); 
//   console.log('<< 2');
// }
// const three = (ctx, next) => {
//   console.log('>> 3');
//   next();
//   console.log('<< 3');
// }
// app.use(one);
// app.use(two);
// app.use(three);

// Use routes
app.use(route.get('/', index));
app.use(route.get('/about', about));
app.use(route.get('/async', asyncDemo));
app.use(route.get('/redirect', redirect));

// app.on('error', (err, ctx) => {
//   console.error(err);
// });