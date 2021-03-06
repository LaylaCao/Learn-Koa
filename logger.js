const Koa = require('koa');
const app = new Koa();
// 实际上 Koa 的中间件能接收的参数有两个: ctx 和 next, 
// next 参数为一个异步函数（调用时须在之前添加 await 关键字，以挂起当前正在运行的中间件）
// 用于转移中间件的运行权：
app.use(async (ctx, next) => {
  console.log('Before calling next()');
  ctx.foo = 'hello!';
  await next();
  console.log('After calling next()');
})

app.use(async ctx => {
  console.log('on response');
  console.log(ctx.foo);
  ctx.body = 'hello world';
});
// 切记调用 next() 函数时，必须添加 await 关键字。 
// next() 函数在一个中间件中只能调用一次，多次调用会发生 next() called multiple times 错误
app.listen(4000, () => {
    console.log('server is starting at port 4000');
});