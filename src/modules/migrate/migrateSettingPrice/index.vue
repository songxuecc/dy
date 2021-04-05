<!-- 我的页面 -->
<template>
  <div class=''>
    <Title class="mt-5 mb-5"/>

    <TableSkuPriceList ref="tableSkuPriceList" @templateError="handleTemplateError"/>
    <div class="common-bottom flex justify-c">
      <el-button style="margin-right: 15px; width:120px" @click="goback" plain type="primary" :loading="loadingGetTPProductByIds">返回</el-button>
      <div>
          <el-button type="primary" :disabled="msgError" @click="toSetTemplate" :loading="loadingGetTPProductByIds">下一步：修改模板</el-button>
          <NewComer type="下一步：修改模板" ref="newComer" >
            <div class="left">
              <div style="width:180px"  class="color-666 font-12">点击此处进行下一步操作</div>
              <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
            </div>
          </NewComer>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
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
    ...mapGetters('migrate/migrateSettingPrice', ['tableDataErrorMsg']),
    ...mapState({
      loadingGetTPProductByIds: state => state['@@loading'].effects['migrate/migrateSettingPrice/getTPProductByIds']
    }),
    msgError () {
      return this.tableDataErrorMsg.some(item => !isEmpty(item)) || this.templateError
    }
  },
  methods: {
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
      // 1. 检查 列表的error和 model的error 是否为空
      // 检查sku价格模版是否有设置为空 空则自动添加数据
      // 检查模版是否更新 否则更新模版
      // 拼接sku 自定义价格的数据

      if (this.msgError) return false
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
