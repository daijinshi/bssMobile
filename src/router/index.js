import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: "home",
      component: () => import(/* webpackChunkName: "dashboard" */ '@/components/common/Home.vue'),
    },
    {
      path: '/login',
      name:"login",
      component: () => import(/* webpackChunkName: "dashboard" */ '@/components/Login.vue'),
    },
    {
      path: '/choose',
      component: () => import(/* webpackChunkName: "dashboard" */ '@/components/Choose.vue'),
    },
    {
      path: '/repairApply',
      name: "repairApply",
      component: () => import(/* webpackChunkName: "dashboard" */ '@/components/RepairApply.vue'),
    },
    {
      path: '/details',
      component: () => import(/* webpackChunkName: "dashboard" */ '@/components/Details.vue'),
    },
    {
      path: '/repairOrder',
      component: () => import(/* webpackChunkName: "dashboard" */ '@/components/RepairOrder.vue'),
    },
    {
      path: '/related',
      component: () => import(/* webpackChunkName: "dashboard" */ '@/components/page/Related.vue'),
    },
  ]
})
