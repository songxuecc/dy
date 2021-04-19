import Vue from 'vue'
import Router from 'vue-router'
// 个人设置
import CustomerService from '@customerSetting/customerService'
import shopsBand from '@customerSetting/shopsBand'
import PaidRecharge from '@customerSetting/paidRecharge'
import SubscribeList from '@customerSetting/subscribeList'
import PayOrder from '@customerSetting/payOrder'
import Login from '@customerSetting/login'
import Fake from '@customerSetting/fake'
import AppInfo from '@customerSetting/appInfo'
// 搬家
import MigrateSettingTemplate from '@migrate/migrateSettingTemplate'
import MigrateSetting from '@migrate/migrateSetting'
import MigrateSettingPrice from '@migrate/migrateSettingPrice'
import ProductList from '@migrate/readyToMigrate'
import StartMigrate from '@migrate/startMigrate'
import MigrateList from '@migrate/migrateList'
import CaptureList from '@migrate/captureList'
// 商品管理
import SkuImport from '@productsManagement/skuImport'
import BatchEdit from '@productsManagement/batchEdit/BatchEdit'
import AllProducts from '@productsManagement/allProducts/DyProductList'
// 更多更能
import MeizheInfo from '@moreFeatures/meizheInfo'
import WodaInfo from '@moreFeatures/wodaInfo'

// 店铺装修 shopDecorate

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
      path: '/customerSetting/meizhe',
      component: MeizheInfo,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/woda',
      component: WodaInfo,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/info',
      name: 'AppInfo',
      component: AppInfo,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/shopsBand',
      name: 'ShopsBand',
      component: shopsBand,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/paidRecharge/:active',
      name: 'PaidRecharge',
      component: PaidRecharge,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/migrate/startMigrate',
      name: 'StartMigrate',
      component: StartMigrate,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateList',
      name: 'MigrateList',
      component: MigrateList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/migrate/captureList',
      name: 'CaptureList',
      component: CaptureList,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateSetting',
      name: 'MigrateSetting',
      component: MigrateSetting,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateSettingPrice',
      name: 'MigrateSettingPrice',
      component: MigrateSettingPrice,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateSettingTemplate',
      name: 'MigrateSettingTemplate',
      component: MigrateSettingTemplate,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },

    {
      path: '/migrate/productList',
      name: 'ProductList',
      component: ProductList,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/productsManagement/allProducts',
      name: 'AllProducts',
      component: AllProducts,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/productsManagement/batchEdit/:tab',
      name: 'BatchEdit',
      component: BatchEdit,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },

    {
      path: '/productsManagement/skuImport',
      name: 'SkuImport',
      component: SkuImport,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/customerSetting/service',
      name: 'CustomerService',
      component: CustomerService,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/authorize',
      name: 'Login',
      component: Login
    },
    {
      path: '/customerSetting/fake',
      name: 'Fake',
      component: Fake,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/customerSetting/my',
      name: 'SubscribeList',
      component: SubscribeList,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/customerSetting/payOrder/:orderId/',
      name: 'PayOrder',
      component: PayOrder,
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/shopDecorate/wm/create/:water_mark_type/:water_mark_id',
      name: 'WaterMaskCreate',
      component: resolve => require(['@shopDecorate/waterMaskCreate'], resolve),
      meta: {
        requiresAuth: true,
        keepAlive: true,
        specialShow: true
      }
    },
    {
      path: '/shopDecorate/poster/dg',
      name: 'PosterDg',
      component: resolve => require(['@shopDecorate/posterDg'], resolve),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'list',
          name: 'PosterDgList',
          component: resolve => require(['@shopDecorate/waterMarkListView'], resolve),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'activity/create',
          name: 'PosterDgActivityCreate',
          component: resolve => require(['@shopDecorate/waterMarkActivityCreateView'], resolve),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'activity',
          name: 'PosterDgActivityList',
          component: resolve => require(['@shopDecorate/waterMarkActivityListView'], resolve),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'activity/detail/:id',
          name: 'PosterDgActivity',
          component: resolve => require(['@shopDecorate/waterMarkActivityView'], resolve),
          meta: {
            keepAlive: true
          }
        }
      ]
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
