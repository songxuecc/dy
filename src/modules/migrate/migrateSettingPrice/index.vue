<!-- 我的页面 -->
<template>
  <div >
    <Title class="mt-5 mb-5" />
    <TableSkuPriceList ref="tableSkuPriceList" @templateError="handleTemplateError"
      v-loading="loadingData" />
    <div class="common-bottom flex justify-c">
      <el-button style="margin-right: 15px; width:120px" @click="goback" :disabled="loadingData" plain
        type="primary" :loading="loadingData">返回</el-button>
      <div>
        <el-button type="primary" :disabled="msgError || loadingData" @click="toSetTemplate"
          :loading="loadingData">下一步：修改模板</el-button>
        <NewComer type="下一步：修改模板" ref="newComer">
          <div class="left">
            <div style="width:180px" class="color-666 font-12">点击此处进行下一步操作</div>
            <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
          </div>
        </NewComer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import Title from './Title'
import TableSkuPriceList from './TableSkuPriceList'
import NewComer from '@/components/NewComer.vue'
import isEmpty from 'lodash/isEmpty'

export default {
  data () {
    return {
      templateError: true
    }
  },
  components: {
    Title,
    TableSkuPriceList,
    NewComer
  },
  computed: {
    ...mapState('migrate/migrateSettingPrice', ['tableData', 'originTableData', 'origin']),
    ...mapGetters('migrate/migrateSettingTemplate', {
      template: 'getTemplate'
    }),
    ...mapGetters('migrate/migrateSettingPrice', ['tableDataErrorMsg', 'dicCustomPrices', 'customPrices']),
    ...mapState({
      loadingGetTPProductByIds: state => state['@@loading'].effects['migrate/migrateSettingPrice/getTPProductByIds'],
      loadingFormatTableData: state => state['@@loading'].effects['migrate/migrateSettingPrice/formatTableData']
    }),
    msgError () {
      return this.tableDataErrorMsg.some(item => !isEmpty(item)) || this.templateError
    },
    loadingData () {
      return this.loadingGetTPProductByIds || this.loadingFormatTableData
    }
  },
  activated () {
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  methods: {
    ...mapActions('migrate/migrateSettingTemplate', [
      'saveTempTemplate'
    ]),
    ...mapMutations('migrate/migrateSettingTemplate', ['save']),
    beforeunloadFn (e) {
      if (this.msgError) return false
      if (!this.template.isDiff() && Object.entries(this.dicCustomPrices).length === 0) {
        return undefined
      }
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    handleTemplateError (value) {
      this.templateError = Object.values(value).some(item => item)
    },
    // 事件名称
    methodsName () {
      this.dialogVisible = false
    },
    closeNewComer () {
      this.$refs.newComer.close && this.$refs.newComer.close()
    },
    toSetTemplate () {
      if (this.msgError) return false
      this.save({
        dicCustomPrices: this.dicCustomPrices
      })
      console.log(this.customPrices, 'customPrices')
      console.log(this.dicCustomPrices, 'dicCustomPrices')
      this.saveTempTemplate()
      this.$router.push({
        path: '/migrateSettingTemplate'
      })
    },
    goback () {
      this.$router.push({
        name: 'ProductList',
        params: {
          keepStatus: true
        }
      })
    }

  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
