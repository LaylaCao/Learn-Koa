// 1.首先要从用户请求中判断HTTP请求方法(GET/POST/PUT/DELETE)
// 2.再判断所请求的地址
// 3.根据请求的方法与地址查找是否已经注册与之匹配的路由处理器
// 4.如果存在以注册的路由处理器则执行该处理器，否则向用户响应404错误代码
// 5.调用 next() 函数执行后续中间件

// 定义了该数组后，我们就可以通过该数组来动态生成不同HTTP方法的 Map 与注册函数。
methods = [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ];
  

// 在构造函数中，同过之前定义的 HTTP 方法列表分别为每一种 HTTP 方法生成一个 Map ，
// 并使用方法名作为键存入 routesMap 属性中。
class Router {
    constructor() {
        this.routesMap = new Map();
        const rm = this.routesMap;
    
        // 根据 HTTP 方法列表动态生成 Map 以存储地址与处理器的映射
        methods.map((method) => {
          rm.set(method, new Map());
        });
      }

    // 接着编写一个通用的路由注册函数，该函数接收三个参数:
    // method: HTTP 方法名
    // pattern: 路由匹配模式（正则表达式）
    // handler: 路由处理函数
    register(method, pattern, handler) {
        let routes = this.routesMap.get(method);
        if (!routes) {
          throw new Error('该HTTP方法不受支持！');
        }
        routes.set(pattern, handler);
    }

    // 编写匹配路由处理函数的函数，该函数接收三个参数：

    // method: HTTP 方法
    // url: 要匹配的 URL
    // ctx: 中间件上下文，用于传递正则表达式捕获块
    // 其中通过 method 来确定在哪一个 Map 中进行查找， url 用于匹配 Map 中的键， ctx 用于传递正则表达式的捕获块以达到路径参数的效果。
    matchHandler(method, url, ctx) {
        let routes = this.routesMap.get(method);
    
        // 路由映射不存在（没实现该HTTP方法）
        if (!routes) {
          return null;
        }
        for (let [key, value] of routes) {
          let matchs;
          if (matchs = key.exec(url)) {
            // 将匹配到的路径参数添加到`ctx`的`params`属性，以便路由处理函数使用
            ctx.params = matchs.slice(1);
            return value;
          }
        }
        return null;
      }
    

    // 写返回 Koa 中间件的函数，该函数返回一个异步函数，
    // 在返回的函数内部获取到用户请求的 HTTP 方法和 URL 地址，
    // 然后调用 matchHandler 函数匹配一个路由处理函数，如匹配到路由处理函数，则执行该执行该函数，否则向用户响应 404 状态码，
    // 最后调用 next() 函数继续执行后续中间件：
    middleware() {
        // 返回一个供Koa使用的中间件函数
        return async (ctx, next) => {
          const method = ctx.request.method;
          const url = ctx.request.url;
          const handler = this.matchHandler(method, url, ctx);
          if (handler) {
            await handler(ctx);
          } else {
            // handler对象为空，则说明没有匹配的路由，响应404状态
            ctx.status = 404;
            ctx.body = '404 Not Found!\n';
          }
          // 调用next函数以继续执行其他中间件
          await next();
        }
      }
    }
    
    // 继续为每一个 HTTP 方法生成一个注册函数，
    // 在这些函数的内部调用之前编写的 register 函数进行注册：
    methods.map((method) => {
        Router.prototype[method.toLowerCase()] = function(pattern, handler) {
          this.register(method, pattern, handler)
        }
      });
      
      module.exports = Router;



