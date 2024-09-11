// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import { createRouter } from './router';

Vue.use(ElementUI);

export function createApp() {
  const router = createRouter();

  const app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })

  return { app, router };
}