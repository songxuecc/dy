<!-- 我的页面 -->
<template>
  <div v-loading="loadingCnt">
    <Head></Head>
    <BasicTemplate ref="basicTemplate"></BasicTemplate>
    <StepDelivery ref="stepDelivery"></StepDelivery>
    <!-- <ShopsMigrate ref="shopsMigrate"></ShopsMigrate> -->
    <!-- 搬家店铺 end -->
    <div class="help-tips" @click="goHelpLink">
      <span><i class="el-icon-s-opportunity"></i>如何填写？</span>
    </div>
    <div class="common-bottom">
        <el-button style="margin-right: 15px" @click="goback">返回</el-button>
        <el-button type="primary" @click="startMigrate">开始搬家</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapGetters, mapState, mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import moment from 'moment'
import utils from '@/common/utils'
import Api from '@/api/apis'
import Head from './Head'
import BasicTemplate from './BasicTemplate'
import StepDelivery from './StepDelivery'
import ShopsMigrate from './ShopsMigrate'

const {
  mapState: mapStateMoving,
  mapActions: mapActionsMoving
} = createNamespacedHelpers('moving/migrateSettingTemplate')

export default {
  data () {
    return {
      isStartMigrate: false,
      loadingCnt: false
    }
  },
  components: {
    Head,
    BasicTemplate,
    StepDelivery,
    ShopsMigrate
  },
  async created () {
    if (isEmpty(this.template.model)) {
      this.loadingCnt = true
      await this.requestTemplate()
      this.loadingCnt = false
    }
  },
  activated () {
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  updated () { },
  watch: {},
  computed: {
    ...mapState(['ownerId']),
    ...mapStateMoving(['template', 'dicCustomPrices']),
    ...mapGetters({
      getSelectTPProductIdList: 'getSelectTPProductIdList'
    })
  },
  methods: {
    ...mapActionsMoving([
      'requestTemplate',
      'removeTempTemplate',
      'setPresellEndTime',
      'removeDicCustomPrices'
    ]),
    ...mapActions([
      'setSelectTPProductIdList'
    ]),
    goHelpLink () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/zghdvq')
    },
    beforeunloadFn (e) {
      e = e || window.event
      if (!this.template.isDiff() && Object.entries(this.dicCustomPrices).length === 0) {
        return undefined
      }
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    goback () {
      this.$router.go(-1)
    },
    validForms () {
      const v1 = new Promise((resolve, reject) => {
        this.$refs.stepDelivery.validate((valid, object) => {
          resolve(valid)
          reject(object)
        })
      })
      const v2 = new Promise((resolve, reject) => {
        this.$refs.basicTemplate.validate((valid, object) => {
          resolve(valid)
          reject(object)
        })
      })
      // todo 多店铺搬家

      return new Promise((resolve, reject) => {
        Promise.all([v1, v2]).then(data => {
          resolve(data.every(b => b))
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取模版params
    getTemplateParams () {
      let keyList = ['pay_type', 'mobile', 'cos_ratio', 'cost_template_id',
        'is_refundable', 'is_folt', 'is_pre_sale', 'shipment_limit_second',
        'group_price_rate', 'group_price_diff', 'single_price_rate', 'single_price_diff',
        'price_rate', 'price_diff', 'origin_price_diff', 'is_sale_price_show_max',
        'presell_type', 'commit_type', 'reduce_type'
      ]
      const model = this.template.model
      const params = pick(model, keyList)
      // 根据不同的发货模式 取字段
      // presell_end_time 字段不在template内 比较的时候 会检测不到他的更新 所以在template设置默认值以便diff
      let presell = {}
      if (model.presell_type === 0) {
        presell = pick(model, ['delivery_delay_day'])
        presell.presell_end_time = ''
      } else if (model.presell_type === 1) {
        presell = pick(model, ['presell_end_time', 'presell_delay'])
        presell.presell_end_time = moment(model.presell_end_time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        presell = pick(model, ['presell_delay', 'step_stock_num_diff'])
        // 抖音阶梯发货 现货都是48小时
        presell.deliver_delay_day = moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
        presell.presell_end_time = ''
      }

      // 处理搬家数据
      const template = Object.assign(params, presell)
      const formatParmas = cloneDeep(template)
      formatParmas.group_price_rate = Math.round(formatParmas.group_price_rate * 100)
      formatParmas.group_price_diff = utils.yuanToFen(formatParmas.group_price_diff)
      formatParmas.single_price_rate = Math.round(formatParmas.single_price_rate * 100)
      formatParmas.single_price_diff = utils.yuanToFen(formatParmas.single_price_diff)
      formatParmas.price_rate = Math.round(formatParmas.price_rate * 100)
      formatParmas.price_diff = utils.yuanToFen(formatParmas.price_diff)
      formatParmas.origin_price_diff = utils.yuanToFen(formatParmas.origin_price_diff)
      return {
        formatParmas,
        template
      }
    },
    getMigrateShop () {
      // 检测必须要选择一个搬家店铺
      // let selfShopId = ''
      // this.originBindList.map(item => {
      //   if (item.is_self) {
      //     selfShopId = item.user_id
      //   } else {
      //     item.user_list.forEach(child => {
      //       if (child.is_self) {
      //         selfShopId = child.user_id
      //       }
      //     })
      //   }
      // })
      // let migrateShop = cloneDeep(this.checkedBindShopList)
      // if (this.checkSelf) {
      //   migrateShop.push(selfShopId)
      // } else {
      //   migrateShop = migrateShop.filter(i => Number(i) !== Number(this.selfShopId))
      // }
      // if (!migrateShop.length) {
      //   this.$message.error('请选择搬家店铺')
      //   return false
      // }
      // 注释多店铺搬家
      // let migrateShop = []
      // if (this.template.model.migrate_shop_template) {
      //   for (let i = 0; i < this.template.model.migrate_shop_template.length; i++) {
      //     let item = this.template.model.migrate_shop_template[i]
      //     if (item.is_migrate === true && item.cost_template_id !== '') {
      //       migrateShop.push({
      //         'user_id': item['user_id'],
      //         'template': {
      //           'cost_template_id': item.cost_template_id
      //         }
      //       })
      //     }
      //   }
      // }
    },
    async  startMigrate () {
      /**
       * 验证
       * 删除template localstorage
       * 检测运费模版是否更新 更新=> 调用接口
       * 设置搬家parmas 搬家
       */
      try {
        const validate = await this.validForms()
        if (!validate) return
        this.removeTempTemplate()
        const {template} = this.getTemplateParams()
        const diffTemplate = this.template.isDiff()
        if (diffTemplate) {
          await Api.hhgjAPIs.updateTemplate(template)
          this.setPresellEndTime(template.presell_end_time)
          this.migrage()
        } else {
          this.migrage()
        }
      } catch (err) {
        this.$message.error(err | err.message)
      }
    },
    async migrage () {
      const self = this
      if (!this.getSelectTPProductIdList.length) {
        this.$message.error('没有选择搬家商品')
        return false
      }
      this.isStartMigrate = true
      try {
        const {formatParmas} = this.getTemplateParams()
      // const migrateShop = this.getMigrateShop()
        let params = {
          template: JSON.stringify(formatParmas),
          migration_type: this.migrate_type,
          pre_sale_date: formatParmas.presell_end_time,
          tp_product_ids: this.getSelectTPProductIdList,
          custom_prices: JSON.stringify(this.dicCustomPrices)
        // 注释多店铺搬家
        // migrate_shop: JSON.stringify(migrateShop.map(userId => ({user_id: userId})))
        }
        await Api.hhgjAPIs.migrate(params)
        if (!this.loadingCnt) {
          this.isStartMigrate = false
          this.setSelectTPProductIdList([])
          this.dicCustomPrices = {}
          this.removeDicCustomPrices()
          this.$alert('搬家任务已在后台生成, 虎虎正在努力为你搬家，您可以继续其它操作', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              self.$router.push({
                name: 'ProductList',
                params: {
                  isMigrateComplete: false,
                  keepStatus: true,
                  needRefresh: true
                }
              })
            }
          })
        }
      } catch (err) {
        this.isStartMigrate = false
        this.$message.error(err | err.message)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.help-tips {
  width: 100px;
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
  i {
    font-size: 13px;
    color: #efb947;
    padding-right: 2px;
  }
}
</style>
