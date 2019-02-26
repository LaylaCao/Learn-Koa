const Koa = require('koa');
var Router = require('koa-router');

// 创建一个Koa对象表示web app本身:
const app = new Koa();
var router = new Router();

/*
    当请求开始时首先请求流通过 x-response-time 和 logging 中间件，
    然后继续移交控制给 response 中间件。
    当一个中间件调用 next() 则该函数暂停并将控制传递给定义的下一个中间件。
    当在下游没有更多的中间件执行后，堆栈将展开并且每个中间件恢复执行其上游行为。
*/


// logger

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.cookies.set('name', 'jialixiaokeai', { signed: true });
});

// response

router.get('/hello-lily', (ctx, next) => {
    ctx.response.body = 'hello,lily';
});

router.get('/hello-world', (ctx, next) => {
    ctx.response.body = 'hello,world';
});

app
    .use(router.routes())
    .use(router.allowedMethods());



app.use(async ctx => {
    ctx.body = 'Hello World';
});
app.keys = ['im a newer secret', 'i like jiali'];
app.listen(3000);


// app.listen是以下方法的语法糖
/*
const http = require('http');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
*/
