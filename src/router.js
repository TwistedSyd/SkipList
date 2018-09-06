/* Import necessary views/comonents to 
   use for routing purposes */ 
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: "/",
        name: 'login',
        component: Login
    },
    {
        path: "/dashboard",
        name: 'dashboard',
        component: Dashboard
    },
    {
        path: '/about',
        name: 'about',
        /* Route level code-splitting
           this generates a separate chunk (about.[hash].js) for this route
          which is lazy-loaded when the route is visited */
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
