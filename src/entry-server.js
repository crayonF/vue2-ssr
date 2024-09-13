// src/server-entry.js
import { createApp } from './main';

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    // 设置服务器端 router 的位置
    router.push(context.url);

    // 等待 router 将可能的异步组件和钩子解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();

      // 如果没有匹配到的组件，返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }
      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        context.state = store.state

        resolve(app)
      }).catch(reject)
    }, reject);
  });
};
