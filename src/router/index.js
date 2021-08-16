import Vue from 'vue'
import Router from 'vue-router'
// 个人设置
import CustomerService from '@customerSetting/customerService'
// import shopsBand from '@customerSetting/shopsBand'
// import PaidRecharge from '@customerSetting/paidRecharge'
import SubscribeList from '@customerSetting/subscribeList'
import PayOrder from '@customerSetting/payOrder'
import Login from '@customerSetting/login'
import Fake from '@customerSetting/fake'
import AppInfo from '@customerSetting/appInfo'
import System from '@customerSetting/system/monitor'
// 搬家
// import MigrateSettingTemplate from '@migrate/migrateSettingTemplate'
// import MigrateSetting from '@migrate/migrateSetting'
// import MigrateSettingPrice from '@migrate/migrateSettingPrice'
// import ProductList from '@migrate/readyToMigrate'
// import StartMigrate from '@migrate/startMigrate'
// import MigrateList from '@migrate/migrateList'
// import CaptureList from '@migrate/captureList'
// import ProductionCollection from '@migrate/productionCollection'

// 商品管理
// import SkuImport from '@productsManagement/skuImport'
// import BatchEdit from '@productsManagement/batchEdit/BatchEdit'
// import AllProducts from '@productsManagement/allProducts/DyProductList'
// 更多更能
// import MeizheInfo from '@moreFeatures/meizheInfo'
// import WodaInfo from '@moreFeatures/wodaInfo'

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
      component: () => import(
        /* webpackChunkName: `MeizheInfo` */
        /* webpackMode: "lazy" */
        '@moreFeatures/meizheInfo'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/woda',
      component: () => import(
        /* webpackChunkName: `WodaInfo` */
        /* webpackMode: "lazy" */
        '@moreFeatures/wodaInfo'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/info',
      name: 'AppInfo',
      component: () => import(
        /* webpackChunkName: `appInfo` */
        /* webpackMode: "lazy" */
        '@customerSetting/appInfo'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/shopsBand',
      name: 'ShopsBand',
      component: () => import(
        /* webpackChunkName: `ShopsBand` */
        /* webpackMode: "lazy" */
        '@customerSetting/shopsBand'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/customerSetting/paidRecharge/:active',
      name: 'PaidRecharge',
      component: () => import(
        /* webpackChunkName: `PaidRecharge` */
        /* webpackMode: "lazy" */
        '@customerSetting/paidRecharge'),
      meta: {
        keepAlive: true
      }
    },

    {
      path: '/migrate/startMigrate',
      name: 'StartMigrate',
      component: () => import(
        /* webpackChunkName: `StartMigrate` */
        /* webpackMode: "lazy" */
        '@migrate/startMigrate'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateList',
      name: 'MigrateList',
      component: () => import(
        /* webpackChunkName: `MigrateList` */
        /* webpackMode: "lazy" */
        '@migrate/migrateList'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/migrate/captureList',
      name: 'CaptureList',
      component: () => import(
        /* webpackChunkName: `CaptureList` */
        /* webpackMode: "lazy" */
        '@migrate/captureList'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateSetting',
      name: 'MigrateSetting',
      component: () => import(
        /* webpackChunkName: `MigrateSetting` */
        /* webpackMode: "lazy" */
        '@migrate/migrateSetting'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateSettingPrice',
      name: 'MigrateSettingPrice',
      component: () => import(
        /* webpackChunkName: `MigrateSettingPrice` */
        /* webpackMode: "lazy" */
        '@migrate/migrateSettingPrice'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/migrateSettingTemplate',
      name: 'MigrateSettingTemplate',
      component: () => import(
        /* webpackChunkName: `MigrateSettingTemplate` */
        /* webpackMode: "lazy" */
        '@migrate/migrateSettingTemplate'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },

    {
      path: '/migrate/productList',
      name: 'ProductList',
      // component: ProductList,
      component: () => import(
        /* webpackChunkName: `ProductList` */
        /* webpackMode: "lazy" */
        '@migrate/readyToMigrate'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/migrate/productionCollection',
      name: 'ProductionCollection',
      component: () => import(
        /* webpackChunkName: `ProductionCollection` */
        /* webpackMode: "lazy" */
        '@migrate/productionCollection'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/productsManagement/allProducts',
      name: 'AllProducts',
      component: () => import(
        /* webpackChunkName: `AllProducts` */
        /* webpackMode: "lazy" */
        '@productsManagement/allProducts/DyProductList'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/productsManagement/productExports',
      name: 'ProductExports',
      component: () => import(
        /* webpackChunkName: `ProductExports` */
        /* webpackMode: "lazy" */
        '@productsManagement/productExports'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },
    {
      path: '/productsManagement/batchEdit/:tab',
      name: 'BatchEdit',
      component: () => import(
        /* webpackChunkName: `BatchEdit` */
        /* webpackMode: "lazy" */
        '@productsManagement/batchEdit'),
      meta: {
        keepAlive: true,
        requiresAuth: true
      }
    },

    {
      path: '/productsManagement/skuImport',
      name: 'SkuImport',
      component: () => import(
        /* webpackChunkName: `SkuImport` */
        /* webpackMode: "lazy" */
        '@productsManagement/skuImport'),
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
      path: '/system/monitor',
      name: 'SystemMonitor',
      component: System,
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
      component: () => import(
        /* webpackChunkName: `waterMaskCreate` */
        /* webpackMode: "lazy" */
        '@shopDecorate/waterMaskCreate'),
      meta: {
        requiresAuth: true,
        keepAlive: true,
        specialShow: true
      }
    },
    {
      path: '/shopDecorate/poster/dg',
      name: 'PosterDg',
      component: () => import(
        /* webpackChunkName: `PosterDg` */
        /* webpackMode: "lazy" */
        '@shopDecorate/posterDg'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'list',
          name: 'PosterDgList',
          component: () => import(
            /* webpackChunkName: `PosterDgList` */
            /* webpackMode: "lazy" */
            '@shopDecorate/waterMarkListView'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'activity/create',
          name: 'PosterDgActivityCreate',
          component: () => import(
            /* webpackChunkName: `PosterDgActivityCreate` */
            /* webpackMode: "lazy" */
            '@shopDecorate/waterMarkActivityCreateView'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'activity',
          name: 'PosterDgActivityList',
          component: () => import(
            /* webpackChunkName: `waterMarkActivityListView` */
            /* webpackMode: "lazy" */
            '@shopDecorate/waterMarkActivityListView'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'activity/detail/:id',
          name: 'PosterDgActivity',
          component: () => import(
            /* webpackChunkName: `waterMarkActivityView` */
            /* webpackMode: "lazy" */
            '@shopDecorate/waterMarkActivityView'),
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
