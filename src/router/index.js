import Vue from 'vue'
import Router from 'vue-router'
import AppInfo from '@/pages/AppInfo'
import Register from '@/pages/Register'
import Migrate from '@/pages/Migrate'
import MigrateList from '@/pages/MigrateList'
import CaptureList from '@/pages/CaptureList'
import ProductList from '@/pages/ProductList'
// import ProductsSync from '@/pages/ProductsSync.vue'
// import PddProductList from '@/pages/PddProductList'
import MigrateSettingPrice from '@/pages/MigrateSettingPrice.vue'
import MigrateSettingTemplate from '@/pages/MigrateSettingTemplate.vue'
import Login from '@/pages/Login'
import Fake from '@/pages/Fake'
import SubscribeList from '@/pages/SubscribeList'
import PayOrder from '@/pages/PayOrder'
import CustomerService from '@/pages/CustomerService.vue'
import ShopDecorate from '@/pages/ShopDecorate'
import WaterMaskCreate from '@/pages/WaterMaskCreate'
import WaterMark from '@/components/WaterMarkView.vue'
// import WhiteBackground from '@/components/WhiteBackgroundNewView.vue'
import WaterMarkList from '@/components/WaterMarkListView.vue'
import WaterMarkActivityCreate from '@/components/WaterMarkActivityCreateView.vue'
import WaterMarkActivityList from '@/components/WaterMarkActivityListView.vue'
import WaterMarkActivity from '@/components/WaterMarkActivityView.vue'

// import WaterMaskCreate2 from '@/pages/WaterMaskCreate2'

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
    // {
    //   path: '/',
    //   component: AppInfo,
    //   meta: {
    //     keepAlive: true
    //   }
    // },
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
    // {
    //   path: '/pddPoductList',
    //   name: 'PddProductList',
    //   component: PddProductList,
    //   meta: {
    //     keepAlive: true,
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/productsSync',
    //   name: 'ProductsSync',
    //   component: ProductsSync,
    //   meta: {
    //     keepAlive: true,
    //     requiresAuth: true
    //   }
    // },
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
    },
    {
      path: '/shopDecorate',
      name: 'ShopDecorate',
      component: ShopDecorate,
      meta: {
        requiresAuth: true
      // keepAlive: true,
      },
      children: [
        {
          path: 'wm',
          name: 'WaterMark',
          component: WaterMark,
          children: [
            {
              path: 'activity',
              name: 'WaterMarkActivityList',
              component: WaterMarkActivityList,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'activity/detail/:id',
              name: 'WaterMarkActivity',
              component: WaterMarkActivity,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'activity/create',
              name: 'WaterMarkActivityCreate',
              component: WaterMarkActivityCreate,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'list',
              name: 'WaterMarkList',
              component: WaterMarkList,
              meta: {
                keepAlive: true
              }
            }
          ]
        }
        // {
        //   path: 'whitebg',
        //   name: 'WhiteBackground',
        //   component: WhiteBackground,
        //   meta: {
        //     keepAlive: true
        //   }
        // }
      ]

    },
    {
      path: '/wm/create',
      name: 'WaterMaskCreate',
      component: WaterMaskCreate,
      meta: {
        requiresAuth: true,
        keepAlive: true,
        specialShow: true
      }
    }
    // {
    //   path: '/wm/create2',
    //   name: 'WaterMaskCreate2',
    //   component: WaterMaskCreate2,
    //   meta: {
    //     requiresAuth: true,
    //     keepAlive: true,
    //     specialShow: true
    //   }
    // }
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
