import Vue from 'vue'
import Router from 'vue-router'
import AppInfo from '@/pages/AppInfo'
import Register from '@/pages/Register'
import Migrate from '@/pages/Migrate'
import MigrateList from '@/pages/MigrateList'
import CaptureList from '@/pages/CaptureList'
import ProductList from '@/pages/ProductList'
import MigrateSettingPrice from '@/pages/MigrateSettingPrice.vue'
import MigrateSettingTemplate from '@/pages/MigrateSettingTemplate.vue'
import Login from '@/pages/Login'
import Fake from '@/pages/Fake'
import SubscribeList from '@/pages/SubscribeList'
import PayOrder from '@/pages/PayOrder'
import CustomerService from '@/pages/CustomerService.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Register,
      meta: {
        keepAlive: true,
        isFullShow: true
      }
    },
    {
      path: '/register',
      component: Register,
      meta: {
        keepAlive: true,
        isFullShow: true
      }
    },
    {
      path: '/info',
      name: 'AppInfo',
      component: AppInfo,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/migrate',
      name: 'Migrate',
      component: Migrate,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/migrateList',
      name: 'MigrateList',
      component: MigrateList,
      meta: {
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/captureList',
      name: 'CaptureList',
      component: CaptureList,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/productList',
      name: 'ProductList',
      component: ProductList,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/migrateSettingPrice',
      name: 'MigrateSettingPrice',
      component: MigrateSettingPrice,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/migrateSettingTemplate',
      name: 'MigrateSettingTemplate',
      component: MigrateSettingTemplate,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/service',
      name: 'CustomerService',
      component: CustomerService,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/authorize',
      name: 'Login',
      component: Login
    },
    {
      path: '/fake',
      name: 'Fake',
      component: Fake,
      meta: {
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/my',
      name: 'SubscribeList',
      component: SubscribeList,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        requiresBind: true
      }
    },
    {
      path: '/payOrder/:orderId/',
      name: 'PayOrder',
      component: PayOrder,
      meta: {
        keepAlive: true,
        requiresAuth: true,
        requiresBind: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let isAuth = JSON.parse(localStorage.getItem('is_auth'))
    if (isAuth) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})

export default router
