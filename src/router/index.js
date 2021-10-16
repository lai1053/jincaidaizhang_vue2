import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/* Sales */

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {path: '/simpleTally', component: _import('simpleTally/index'), hidden: true},  // 简易记账，jsp嵌套页面
  {
    path: '/',
    component: Layout,
    // redirect: '/dashboard',
    meta: {allowBack: false},
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },

  {
    path: '/sales',
    component: Layout,
    redirect: '/sales/index',
    name: '销售首页',
    meta: {title: '销售', icon: 'fa fa-chart-line fa-lg fa-chart-line-color'},
    children: [
      {
        path: 'index',
        name: '销售',
        component: _import('sales/index'),
        meta: {title: '销售', icon: 'fa fa-chart-line fa-lg fa-chart-line-color'}
      }
    ]
  },

  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/index',
    name: '采购',
    meta: {title: '采购', icon: 'fa fa-shopping-cart fa-lg fa-shopping-cart-color'},
    children: [{
      path: 'index',
      name: '采购首页',
      component: _import('purchase/index'),
      meta: {title: '采购', icon: 'fa fa-shopping-cart fa-lg fa-shopping-cart-color'}
    }]
  },

  {
    path: '/expense',
    component: Layout,
    redirect: '/expense/index',
    name: '费用',
    meta: {title: '费用', icon: 'fa fa-money-bill-alt fa-lg fa-money-bill-alt-color'},
    children: [
      {
        path: 'index',
        name: '费用首页',
        component: _import('expense/index'),
        meta: {title: '费用', icon: 'far fa-money-bill-alt fa-lg fa-money-bill-alt-color'}
      }
    ]
  },
  {
    path: '/fund',
    component: Layout,
    redirect: '/fund/index',
    name: '资金',
    meta: {title: '资金', icon: 'fas fa-yen-sign fa-lg fa-yen-sign-color'},
    children: [
      {
        path: 'index',
        name: '资金首页',
        component: _import('fund/index'),
        meta: {title: '资金', icon: 'fas fa-yen-sign fa-lg fa-yen-sign-color'}
      }
    ]
  },
  {
    path: '/salary',
    component: Layout,
    redirect: '/salary/index',
    name: '工资表',
    meta: {title: '工资表', icon: 'fas fa-bar-chart fa-lg fa-bar-chart-color'},
    children: [
      {
        path: 'index',
        name: '工资表首页',
        component: _import('salary/index'),
        meta: {title: '工资表', icon: 'fas fa-bar-chart fa-lg fa-bar-chart-color'}
      }
    ]
  },
  {
    path: '/pending',
    component: Layout,
    redirect: '/pending/index',
    name: '待用区',
    meta: {title: '待用区', icon: 'fas fa-box fa-lg fa-box-color'},
    children: [
      {
        path: 'index',
        name: '回收站首页',
        component: _import('pending/index'),
        meta: {title: '回收站', icon: 'fas fa-box fa-lg fa-box-color'}
      }
    ]
  },
  {
    path: '/math',
    component: Layout,
    redirect: '/math/index',
    name: '科目匹配',
    meta: {title: '科目匹配', icon: 'fas fa-box fa-lg fa-yen-sign-color'},
    children: [
      {
        path: 'index',
        name: '科目匹配首页',
        component: _import('math/index'),
        meta: {title: '科目匹配', icon: 'fa fa-copy fa-lg fa-yen-sign-color'}
      }
    ]
  },
  {
    path: '/simpleTally',
    component: Layout,
    redirect: '/simpleTally/index',
    name: '会计快报',
    meta: {title: '科目匹配', icon: 'fas fa-box fa-lg fa-yen-sign-color'},
    children: [
      {
        path: 'index',
        name: '会计快报首页',
        component: _import('simpleTally/index'),
        meta: {title: '会计快报', icon: 'fa fa-pencil-square-o fa-lg fa-shopping-cart-color'}
      }
    ]
  },
  {
    path: '/psb',
    component: Layout,
    redirect: '/psb/index',
    name: '票税宝',
    meta: {title: '票税宝', icon: 'fas fa-box fa-lg fa-yen-sign-color'},
    children: [
      {
        path: 'index',
        name: '票税宝首页',
        component: _import('expense/psb/index'),
        meta: {title: '票税宝', icon: 'fa fa-pencil-square-o fa-lg fa-shopping-cart-color'}
      }
    ]
  }

  // {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
