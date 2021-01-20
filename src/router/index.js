import Vue from 'vue'
import Router from 'vue-router'
import AppInfo from '@/pages/AppInfo'
import MeizheInfo from '@/pages/MeizheInfo'
import WodaInfo from '@/pages/WodaInfo'
import Migrate from '@/pages/Migrate'
import MigrateList from '@/pages/MigrateList'
import CaptureList from '@/pages/CaptureList'
import DyProductList from '@/pages/DyProductList'
import BatchEdit from '@/pages/BatchEdit'
import MigrateSettingPrice from '@/pages/MigrateSettingPrice.vue'
import Login from '@/pages/Login'
import Fake from '@/pages/Fake'
import SubscribeList from '@/pages/SubscribeList'
import PayOrder from '@/pages/PayOrder'
import CustomerService from '@/pages/CustomerService.vue'
import MigrateSetting from '@/components/MigrateSetting.vue'
import shopsBand from '@/modules/moving/shopsBand'
import MigrateSettingTemplate from '@/modules/moving/migrateSettingTemplate'
import ProductList from '@/modules/moving/readyToMigrate'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: AppInfo,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/meizhe',
      component: MeizheInfo,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/woda',
      component: WodaInfo,
      meta: {
        keepAlive: true
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
      path: '/setting/shopsBand',
      name: '绑定店铺',
      component: shopsBand,
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
        requiresAuth: true
      }
    },
    {
      path: '/migrateList',
      name: 'MigrateList',
      component: MigrateList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/captureList',
      name: 'CaptureList',
      component: CaptureList,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/productList',
      name: 'ProductList',
      component: ProductList,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/dyProductList',
      name: 'DyProductList',
      component: DyProductList,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/batchEdit/:tab',
      name: 'BatchEdit',
      component: BatchEdit,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrateSetting',
      name: 'MigrateSetting',
      component: MigrateSetting,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrateSettingPrice',
      name: 'MigrateSettingPrice',
      component: MigrateSettingPrice,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrateSettingTemplate',
      name: 'MigrateSettingTemplate',
      component: MigrateSettingTemplate,
      meta: {
        keepAlive: true,
        requiresAuth: true
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
        requiresAuth: true
      }
    },
    {
      path: '/my',
      name: 'SubscribeList',
      component: SubscribeList,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/payOrder/:orderId/',
      name: 'PayOrder',
      component: PayOrder,
      meta: {
        keepAlive: true,
        requiresAuth: true
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
