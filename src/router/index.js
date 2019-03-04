import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/main'
import Email from '@/pages/email'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/email',
      name: 'Email',
      component: Email
    }
  ]
})
