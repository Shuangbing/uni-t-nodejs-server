import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import SchoolsList from './views/Schools/List'
import SchoolsEdit from './views/Schools/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        { path: '/schools/create', component: SchoolsEdit },
        { path: '/schools/edit/:id', component: SchoolsEdit, props: true },
        { path: '/schools/list', component: SchoolsList }
      ]
    },
    
  ]
})
