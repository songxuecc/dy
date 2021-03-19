<!-- 我的页面 -->
<template>
  <div v-loading="loadingCnt">
    <Head></Head>
    <BasicTemplate ref="basicTemplate"></BasicTemplate>
    <StepDelivery ref="stepDelivery"></StepDelivery>
    <ShopsMigrate ref="shopsMigrate"></ShopsMigrate>
    <!-- 搬家店铺 end -->
    <div class="help-tips" @click="goHelpLink">
      <span class="pointer"><i class="el-icon-s-opportunity"></i>如何填写？</span>
    </div>
    <div class="common-bottom  flex justify-c">
        <el-button style="margin-right: 15px;width:120px" @click="goback"  plain type="primary">返回</el-button>
        <div>
          <el-button type="primary" style="width:120px" @click="startMigrate">开始搬家</el-button>
          <NewComer type="开始搬家" ref="newComer" >
            <div class="left">
              <div style="width:180px"  class="color-666 font-12">点击此处开始搬家</div>
              <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
            </div>
          </NewComer>
        </div>
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
import Head from '@migrate/migrateSettingTemplate/Head'
import BasicTemplate from '@migrate/migrateSettingTemplate/BasicTemplate'
import StepDelivery from '@migrate/migrateSettingTemplate/StepDelivery'
import ShopsMigrate from '@migrate/migrateSettingTemplate/ShopsMigrate'
import NewComer from '@/components/NewComer.vue'

const {
  mapState: mapStateMigrate,
  mapActions: mapActionsMigrate
} = createNamespacedHelpers('migrate/migrateSettingTemplate')

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
    ShopsMigrate,
    NewComer
  },
  async created () {
    if (isEmpty(this.template.model)) {
      this.loadingCnt = true
      await this.requestTemplate()
      this.loadingCnt = false
    }
    // this.getUserBindList()
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
    ...mapState(['userId']),
    ...mapStateMigrate(['template', 'dicCustomPrices', 'userBindList']),
    ...mapGetters(['getUserId', 'getSelectTPProductIdList'])

  },
  methods: {
    ...mapActionsMigrate([
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
        'presell_type', 'commit_type', 'reduce_type', 'product_type'
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
    getSelfShopId (data) {
      let selfShopId = ''
      this.userBindList.map(item => {
        if (item.is_self) {
          selfShopId = item.user_id
          item.name = ''
        } else {
          item.user_list.forEach(child => {
            if (child.is_self) {
              selfShopId = child.user_id
            }
          })
        }
      })
      return selfShopId
    },
    getMigrateShop () {
      // 检测必须要选择一个搬家店铺
      let migrateShop = []
      let selfShopId = this.getUserId
      if (!selfShopId) {
        selfShopId = this.getSelfShopId()
      }
      if (this.$refs.shopsMigrate) {
        if (this.$refs.shopsMigrate.checkSelf) migrateShop.push(selfShopId)
        if (this.$refs.shopsMigrate.checkedBindShopList) {
          migrateShop = new Set([...migrateShop, ...this.$refs.shopsMigrate.checkedBindShopList])
        }
      }
      if (!migrateShop.size) {
        this.$message.error('请选择搬家店铺')
        return undefined
      }
      const costTemplateMap = this.$refs.shopsMigrate.costTemplateMap
      const hascontTemplate = this.$refs.shopsMigrate.checkedBindShopList.every(id => {
        return typeof costTemplateMap.get(id) !== 'undefined'
      })
      if (!hascontTemplate) {
        this.$message.error('搬家店铺有店铺没有选择运费模版，请审查！')
        return undefined
      }
      const selfCostTemplateId = this.template.model.cost_template_id
      const result = [...migrateShop].map(id => {
        let costTemplateId = costTemplateMap.get(id)
        if (id === selfShopId) {
          costTemplateId = selfCostTemplateId
        }
        return {user_id: id, template: {cost_template_id: costTemplateId}}
      })
      if (result) {
        localStorage.setItem('migrate_shop', JSON.stringify(result))
        return result
      }
      return undefined
    },
    updateTemplate () {
      try {
        const {template} = this.getTemplateParams()
        const diffTemplate = this.template.isDiff()
        if (diffTemplate) {
          Api.hhgjAPIs.updateTemplate(template)
        }
      } catch (err) {
        this.$message.error(`${err || err.message}`)
      }
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
        if (!validate) return this.$message.error('请按提示正确填写模版')
        this.removeTempTemplate()
        this.updateTemplate()
        const {template} = this.getTemplateParams()
        this.setPresellEndTime(template.presell_end_time)
        this.migrage()
      } catch (err) {
        this.$message.error(`${err || err.message}`)
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
        const migrateShop = this.getMigrateShop()
        if (!migrateShop) {
          return false
        }
        let params = {
          template: JSON.stringify(formatParmas),
          migration_type: this.migrate_type,
          pre_sale_date: formatParmas.presell_end_time,
          tp_product_ids: this.getSelectTPProductIdList,
          custom_prices: JSON.stringify(this.dicCustomPrices),
          migrate_shop: JSON.stringify(migrateShop)
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
        this.$message.error(`${err || err.message}`)
      }
    },
    closeNewComer () {
      this.$refs.newComer.close && this.$refs.newComer.close()
    }
  }
}
</script>

<style lang='less' scoped>
.help-tips {
  width: 100%;
  font-size: 12px;
  color: #409EFF;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 100px;
  box-sizing: border-box;
  i {
    font-size: 13px;
    color: #efb947;
    padding-right: 2px;
  }
}
</style>
