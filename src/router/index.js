import Vue from 'vue'
import VueRouter from 'vue-router'
import EnterpriseDataPage from '@/views/enterprisedata/EnterpriseData'
import EnterpriseNodeList from "@/views/enterprisedata/EnterpriseNodeList";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: EnterpriseDataPage,
  },
  {
    path: '/enterprisenode/:fileid',
    name: 'EnterpriseNode',
    component: EnterpriseNodeList,
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

export default router
