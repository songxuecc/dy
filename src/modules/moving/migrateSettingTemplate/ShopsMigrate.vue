<template lang="html">
    <div class="setting-content-with-tip">
        <el-form label-width="120px"  size="small" ref="form">
        <el-form-item label="搬家店铺:">
            <el-checkbox
            v-model="checkSelf"
            class="current-shop">
            本店铺</el-checkbox>
            <div v-for="(parentShop,idx) in bindList" :key="idx" class="group">
            <div v-if="parentShop.is_main" class="is-main">
                <el-checkbox
                @change="handleCheckAllChange($event,Number(parentShop.user_id))"
                :value="isIndeterminate  ? isIndeterminate[`isIndeterminate${parentShop.user_id}`] : false"
                style="margin-right:10px"
                >全选&nbsp;&nbsp;{{parentShop.shop_name}} 是主店铺</el-checkbox>
            </div>
            <el-checkbox-group
                v-model="checkedBindShopList"
                @change="handleCheckedBindListValueChange($event,Number(parentShop.user_id))">
                <el-checkbox
                v-for="childShop in parentShop.user_list"
                :label="Number(childShop.user_id)"
                :key="Number(childShop.user_id)"
                :disabled="parentShop.auth_status === 'expire'"
                v-if="!childShop.is_self"
                class="checkbox">
                    <div class="label-name">
                    <span>{{childShop.shop_name}}</span>
                    <span>({{childShop.auth_status === 'expire' ? '过期': childShop.first_category_name_list.join('、') }})</span>
                    <span v-html="getCannotMigrateShops(childShop.able_migrate_tp_product_id_list)"></span>
                    </div>
                </el-checkbox>
            </el-checkbox-group>
            </div>
            <p class="diffrent-category-tip"><span >*</span>仅允许搬家商品一级类目与店铺一级类目相同的商品</p>
        </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { createNamespacedHelpers, mapGetters, mapState, mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

const {
  mapActions: mapActionsMoving,
  mapGetters: mapGettersMoving
} = createNamespacedHelpers('moving/migrateSettingTemplate')

export default {
  components: {
  },
  data () {
    return {
      // 多选
      checkSelf: true,
      checkAll: false,
      checkedBindShopList: [],
      isIndeterminate: undefined,
      bindList: [],
      bindListValue: {}
    }
  },
  computed: {
    ...mapGettersMoving({
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices'
    }),
    ...mapGetters({
      getSelectTPProductIdList: 'getSelectTPProductIdList'
    }),
    ...mapState(['ownerId'])
  },
  methods: {
    ...mapActionsMoving([
      'requestTemplate',
      'loadTempTemplate',
      'removeTempTemplate',
      'removeDicCustomPrices',
      'saveTempTemplate'
    ]),
    ...mapActions([
      'setSelectTPProductIdList'
    ]),
    getCannotMigrateShops (num) {
      if (!this.getSelectTPProductIdList) return ''
      const total = this.getSelectTPProductIdList.length || 0
      const str = total - num > 0 ? total - num : 0
      if (!str) return ''
      return `<p class="label-tip">预计有${str}个商品不可搬家</p>`
    },
    handleCheckedBindListValueChange (value, userId) {
      //  全选
      const currentGroup = this.bindList.find(item => Number(item.user_id) === Number(userId))
      if (currentGroup) {
        const childs = currentGroup.user_list || []
        const indeterminate = []
        childs.map(item => {
          const childUserId = Number(item.user_id)
          const childIndex = value.findIndex(v => childUserId === Number(v))
          if (childIndex > -1) {
            indeterminate.push(item.user_id)
          }
        })
        //  vue很傻逼 vue中数据更改了，但是视图没有更新 必须要重新复制一个新对象
        if (indeterminate.length === (currentGroup.user_list.length)) {
          this.isIndeterminate = {...cloneDeep(this.isIndeterminate), [`isIndeterminate${userId}`]: true}
        } else {
          this.isIndeterminate = {...cloneDeep(this.isIndeterminate), [`isIndeterminate${userId}`]: false}
        }
      }
    },
    //  全选 反选
    handleCheckAllChange (value, userId) {
      const currentGroup = this.bindList.find(item => Number(item.user_id) === Number(userId))
      const childs = (currentGroup.user_list || []).map(item => Number(item.user_id))
      childs.push(Number(userId))
      if (value) {
        //  vue很傻逼 vue中数据更改了，但是视图没有更新 必须要重新复制一个新对象
        this.isIndeterminate = cloneDeep(this.isIndeterminate || {})
        this.isIndeterminate[`isIndeterminate${userId}`] = true
        const unitcheckedBindShopList = this.checkedBindShopList.concat(childs).map(item => Number(item))
        const nextcheckedBindShopList = [...new Set(unitcheckedBindShopList)]
        this.checkedBindShopList = nextcheckedBindShopList
      } else {
        //  vue很傻逼 vue中数据更改了，但是视图没有更新 必须要重新复制一个新对象
        this.isIndeterminate = cloneDeep(this.isIndeterminate || {})
        this.isIndeterminate[`isIndeterminate${userId}`] = false
        const childsSet = new Set(childs)
        const checkedBindShopListSet = new Set(this.checkedBindShopList)
        const nextcheckedBindShopList = [...checkedBindShopListSet].filter(item => !childsSet.has(Number(item)))
        this.checkedBindShopList = [...nextcheckedBindShopList]
      }
    },
    async validate () {
      const validate = await this.$refs.form.validate()
      return validate
    }
  }
}
</script>

<style lang="less" scoped>
.help-tips {
  width: 100px;
  right: 0px;
  bottom: 15px;
  position: absolute;
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
  i {
    font-size: 13px;
    color: #efb947;
    padding-right: 2px;
  }
}

.setting-content-with-tip {
  /deep/ .el-checkbox__label {
    font-size: 12px;
  }
  /deep/ .el-checkbox__inner {
    width: 12px;
    height: 12px;
  }
  /deep/ .el-checkbox__inner::after {
    left: 3px;
    top: 0px;
  }
  /deep/ .label-tip {
    position:absolute;
    font-size: 12px;
    color:#999999
  }
  .checkbox {
    margin-bottom: 8px;
  }
  .current-shop {
    margin-bottom: 10px;
    line-height: 12px;
  }
  .group {
    margin-bottom: 14px;
  }
  .is-main {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #333333;
  }
  .label-name {
    position:relative;
  }
  .diffrent-category-tip {
    margin-top: 14px;
    color:#999999;
    font-size: 12px;
    span {
      color: red;
      margin-right: 4px;
    }
  }
}

.step-delivery {
  .info {
    color: #999999;
    font-size: 12px;
    line-height: 12px;
  }
  .presell_type {
    display: block;
    margin-bottom: 8px;
    p {
      color: #999999;
      font-size: 12px;
      line-height: 14px;
      margin-left: 26px;
    }
  }

  /deep/ .el-input-number.is-controls-right .el-input__inner {
    padding: 0;
  }
  .input-number {
    margin-left: 5px;
    margin-right: 5px;
  }
  span {
    color:#606266;
  }
  .margin-bottom-4 {
    margin-bottom: 4px;
  }
}

</style>
