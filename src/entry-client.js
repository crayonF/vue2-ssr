// src/client-entry.js
import { createApp } from './main';

const { app, router } = createApp();

// 等待路由器准备好后再挂载应用
router.onReady(() => {
  app.$mount('#app');
});
