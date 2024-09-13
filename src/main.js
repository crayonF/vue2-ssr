// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import { createRouter } from './router';
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

Vue.use(ElementUI);


// 仅客户端时才渲染
if (typeof window !== 'undefined') {
  window.aaa = '1111'
}

const router = createRouter();
const store = createStore()

export function createApp() {
  sync(store, router)

  const app = new Vue({
    store,
    router,
    render: h => h(App)
  })

  return { app, router, store };
}