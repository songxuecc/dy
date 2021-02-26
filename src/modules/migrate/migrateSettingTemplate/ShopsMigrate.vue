<template lang="html">
  <div class="setting-content-with-tip" v-if="userBindList.length">
    <el-form label-width="120px" size="small">
      <el-form-item label="搬家店铺:">
        <el-checkbox v-model="checkSelf" class="current-shop">
          本店铺</el-checkbox>
        <div v-for="(parentShop,idx) in userBindList" :key="idx">
          <div v-if="parentShop.is_main" class="is-main">
            <el-checkbox :value="checkAllMap.get(Number(parentShop.user_id))" style="margin-right:10px"
              @change="handleCheckAllChange($event,Number(parentShop.user_id),idx)" :disabled="getDisabled(parentShop)">
              全选&nbsp;&nbsp;{{parentShop.shop_name}} 是主店铺
            </el-checkbox>
          </div>
          <el-checkbox-group v-model="checkedBindShopList"
            @change="handleCheckboxGroupChange($event,Number(parentShop.user_id),idx)">
            <span v-for="childShop in parentShop.user_list" :key="Number(childShop.user_id)"  v-if="!childShop.is_self" style="width:calc(50% - 35px);display:inline-block">
              <el-checkbox :label="Number(childShop.user_id)"
                :disabled="['expire','un_login'].includes(childShop.auth_status)" class="checkbox" >
                <div class="label-name">
                  <span>{{childShop.shop_name}}</span>
                  <span v-if="['expire'].includes(childShop.auth_status)">(订购过期)</span>
                  <span v-if="['un_login'].includes(childShop.auth_status)">(需重新登录)</span>
                </div>
              </el-checkbox>
              <span v-if="!['expire','un_login'].includes(childShop.auth_status)" class="ml-10">
                <el-select :value="costTemplateMap.get(childShop.user_id)" placeholder="选择运费模版" size="mini"
                  @change="handleSelect($event,childShop.user_id,idx)">
                  <el-option v-for="item in (childShop.cost_template_list || [])" :key="item.template.id" :label="item.template.template_name"
                    :value="item.template.id">
                  </el-option>
                </el-select>
                <el-button type="text"><i class="el-icon-refresh" @click="getTargetCostTemplateList(childShop.user_id)">刷新</i></el-button>
                <el-button type="text" @click="open()">添加运费模版</el-button>
              </span>
            </span>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { createNamespacedHelpers, mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

const {
  mapActions,
  mapState
} = createNamespacedHelpers('migrate/migrateSettingTemplate')

export default {
  data () {
    return {
      checkSelf: true,
      checkedBindShopList: [],
      bindList: [],
      checkAllMap: new Map(),
      costTemplateMap: new Map()
    }
  },
  activated () {
    this.getUserBindList()
  },
  watch: {
    userBindList (newVal) {
      const migrateShop = JSON.parse(localStorage.getItem('migrate_shop')) || []
      const costTemplateMap = new Map()
      // 运费模板默认选择包邮模板
      newVal.forEach(parent => {
        parent.user_list.forEach(child => {
          const hasFreeTemplate = child.cost_template_list.find(c => c.template.id === 0)
          if (hasFreeTemplate) costTemplateMap.set(child.user_id, 0)
        })
      })
      // 运费模板选择上次搬家的模版
      migrateShop.forEach(item => {
        costTemplateMap.set(item.user_id, item.template.cost_template_id)
      })
      this.costTemplateMap = costTemplateMap
    }
  },
  computed: {
    ...mapState(['userBindList']),
    ...mapGetters({
      getSelectTPProductIdList: 'getSelectTPProductIdList'
    })
  },
  methods: {
    ...mapActions([
      'getUserBindList',
      'getCostTemplateList'
    ]),
    getDisabled (shops) {
      const disabled = shops.user_list.filter(item => !item.is_self && !['expire', 'un_login'].includes(item.auth_status))
      return !disabled.length
    },
    getCannotMigrateShops (num) {
      if (!this.getSelectTPProductIdList) return ''
      const total = this.getSelectTPProductIdList.length || 0
      const str = total - num > 0 ? total - num : 0
      if (!str) return ''
      return `<p class="label-tip">预计有${str}个商品不可搬家</p>`
    },
    handleCheckboxGroupChange (value, userId, idx) {
      const childShops = (cloneDeep(this.userBindList)[idx] || []).user_list
        .filter(item => !item.is_self && !['expire', 'un_login'].includes(item.auth_status))
        .map(item => Number(item.user_id))
      if (childShops.length) {
        const checkAllMap = new Map(this.checkAllMap)
        const checkAll = childShops.every(child => value.find(item => item === child))
        // 全选
        if (checkAll) {
          checkAllMap.set(userId, true)
          this.checkAllMap = checkAllMap
        } else {
          checkAllMap.set(userId, false)
          this.checkAllMap = checkAllMap
        }
      }
    },
    //  全选 反选 需要剔除disabled的店铺
    handleCheckAllChange (value, userId, idx) {
      const childShops = (cloneDeep(this.userBindList)[idx] || []).user_list
        .filter(item => !item.is_self && !['expire', 'un_login'].includes(item.auth_status))
        .map(item => Number(item.user_id))
      const checkedValue = cloneDeep(this.checkedBindShopList)
      const childShopsSet = new Set(childShops)
      const checkedValueSet = new Set(checkedValue)
      let checkedBindShopList = []
      if (value) {
        const unionSet = new Set([...childShopsSet, ...checkedValueSet])
        checkedBindShopList = [...unionSet]
      } else {
        const differenceSet = new Set([...checkedValueSet].filter(checked => !childShopsSet.has(checked)))
        checkedBindShopList = [...differenceSet]
      }
      // 是否全选根据子元素全选满足
      const checkAllMap = new Map(this.checkAllMap)
      cloneDeep(this.userBindList).forEach(child => {
        const childShopIds = child.user_list
          .filter(item => !item.is_self && !['expire', 'un_login'].includes(item.auth_status))
          .map(item => Number(item.user_id))
        const checkAll = childShopIds.every(child => checkedBindShopList.find(item => item === child))
        if (checkAll) {
          checkAllMap.set(child.user_id, true)
        } else {
          checkAllMap.set(child.user_id, false)
        }
      })

      this.checkAllMap = checkAllMap
      this.checkedBindShopList = checkedBindShopList
    },
    handleSelect (value, id) {
      const costTemplateMap = new Map(this.costTemplateMap)
      costTemplateMap.set(id, value)
      this.costTemplateMap = costTemplateMap
    },
    getTargetCostTemplateList (targetUserId) {
      this.getCostTemplateList({
        targetUserId
      })
    },
    open () {
      window.open('https://fxg.jinritemai.com/index.html#/ffa/morder/logistics/freight-list')
    }
  }
}
</script>

<style lang="less" scoped>
    @import '~@/assets/css/migratesetting.less';
   /deep/ .el-button+.el-button{
     margin-left:0
   }
   /deep/ .el-form-item {
        margin-bottom: 0;
    }
</style>
