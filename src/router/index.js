import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/components/About')
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('@/components/Test')
      }
    ]
  })
}
