import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'

import Login from './views/Login.vue'

import SchoolsList from './views/Schools/List'
import SchoolsEdit from './views/Schools/Edit'

import UsersList from './views/Users/List'
import UserEdit from './views/Users/Edit'

import AdminList from './views/AdminUsers/List'
import AdminEdit from './views/AdminUsers/Edit'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        { path: '/schools/create', component: SchoolsEdit },
        { path: '/schools/edit/:id', component: SchoolsEdit, props: true },
        { path: '/schools/list', component: SchoolsList },

        { path: '/users/list', component: UsersList },
        { path: '/users/edit/:id', component: UserEdit, props: true},
        { path: '/admins/create', component: AdminEdit },

        { path: '/admins/list', component: AdminList },
        { path: '/admins/edit/:id', component: AdminEdit, props: true},
      ]
    },
    {
      path: '/login', name: 'login', component: Login, meta: {isPublic : true}
    }
    
  ]
})
router.beforeEach((to, from, next) => {
  if(!to.meta.isPublic && !localStorage.token) {
    return next('/login')
  }
  next()
})
export default router