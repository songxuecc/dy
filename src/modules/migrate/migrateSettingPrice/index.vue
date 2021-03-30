<!-- 我的页面 -->
<template>
  <div class=''>
    <Title class="mt-5 mb-5"/>

    <TableSkuPriceList />
    <div class="common-bottom flex justify-c">
      <el-button style="margin-right: 15px; width:120px" @click="goback" plain type="primary">返回</el-button>
      <!-- <el-tooltip placement="top" :disabled="msgError === ''" :content="msgError"> -->
      <div>
          <el-button type="primary" :disabled="msgError !== ''" @click="toSetTemplate">下一步：修改模板</el-button>
          <NewComer type="下一步：修改模板" ref="newComer" >
            <div class="left">
              <div style="width:180px"  class="color-666 font-12">点击此处进行下一步操作</div>
              <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
            </div>
          </NewComer>
      </div>
      <!-- </el-tooltip> -->
    </div>

  </div>
</template>

<script>
// import { mapActions, mapState, mapGetters } from 'vuex'

import Title from './Title'
import TableSkuPriceList from './TableSkuPriceList'
import NewComer from '@/components/NewComer.vue'
export default {
  data () {
    return {

    }
  },
  computed: {
  },
  components: {
    Title,
    TableSkuPriceList,
    NewComer
  },
  watch: {},
  created () {

  },
  mounted () {
  },
  updated () { },
  methods: {

    // 事件名称
    methodsName () {
      this.dialogVisible = false
    },
    closeNewComer () {
      this.$refs.newComer.close && this.$refs.newComer.close()
    },
    toSetTemplate () {

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
