<!-- 我的页面 -->
<template>
  <div class='productQualityScore left'>
    <div class="flex">
        <div class="left" :class="[!overviewData.is_standard && 'fail']">{{overviewData.standard_rate}}%</div>
        <div class="right">
            <h3>
              商品及处分不达标商品{{overviewData.product_num_to_improve_total}}个，达标率{{overviewData.standard_rate}}%<span v-if="!overviewData.is_standard">，远低于及格线，影响店铺流量转化，请尽快优化 <span class="color-primary pointer" @click="check">查看如何优化</span></span>
            </h3>
            <div v-for="list in overviewData.problem_type_distribution" :key="list.type_key">
              <span class="width-100">{{list.type_name}}</span> <span class="color-333">{{list.num}}个</span>
            </div>
            <div>
              <span class="width-100">检测时间</span>
              <span class="color-333">{{overviewData.task_finish_time}}</span>
            </div>
        </div>
    </div>

    <h1 class="title">可优化商品</h1>
    <TableProductList></TableProductList>
  </div>
</template>

<script>

import TableProductList from './components/TableProductList'
import servises from '@servises'
import { mapActions } from 'vuex'

export default {
  components: {
    TableProductList
  },
  data () {
    return {
      overviewData: {},
      type: {
        1: '商品信息不规范',
        2: '关键信息待优化',
        3: '商品素材缺失'
      }
    }
  },
  computed: {

  },
  created () {
    this.init()
  },
  mounted () {

  },
  updated () {

  },
  methods: {
    ...mapActions('productManagement/productQualityScore/tableProductList', [
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'clear',
      'fetch'
    ]),
    async init () {
      const data = await servises.productQualityScoreOverview()
      const id = data.task_id
      this.overviewData = data
      this.fetch({
        filters: {
          task_id: id
        }
      })
    },
    // 事件名称
    check () {
    }
  }
}
</script>

<style lang='less' scoped>
@import '~./index.less';
</style>
