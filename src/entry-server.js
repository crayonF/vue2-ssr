// src/server-entry.js
import { createApp } from './main';

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp();

    // 设置服务器端 router 的位置
    router.push(context.url);

    // 等待 router 将可能的异步组件和钩子解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();

      // 如果没有匹配到的组件，返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      // 返回 Vue 实例，供 vue-server-renderer 渲染
      resolve(app);
    }, reject);
  });
};
