/* Import necessary views/comonents to 
   use for routing purposes */ 
import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'

Vue.use(Router)

/* Set view names, paths, etc */
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
    {
        path: "/",
        name: 'login',
        component: Login
    },
    {
        path: "/dashboard",
        name: 'dashboard',
        component: Dashboard
    }
  ]
})
