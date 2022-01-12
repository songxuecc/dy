<!-- 检测记录  -->
<template>
    <div class=" detectDuplicateProducts-record">
      <h1 class="title left">检测记录</h1>
      <TableRecord></TableRecord>
      <el-button @click="goto" type="primary" class="mt-20">返回重复铺货检测</el-button>
    </div>
</template>

<script>
import TableRecord from './TableRecord'
import { mapActions } from 'vuex'

export default {
  name: 'record',
  props: {
    msg: String
  },
  components: {
    TableRecord
  },
  data () {
    return {
    }
  },
  created () {

  },
  activated () {
    this.fetch({
      filters: {
        task_sub_type_list: '[102, 103]'
      }
    })
  },
  methods: {
    ...mapActions('productManagement/detectDuplicateProducts/tableRecord', [
      'fetch'
    ]),
    goto () {
      this.$router.push({
        name: 'detectDuplicateProducts_DetectProductList'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.detectDuplicateProducts-record {
  padding: 20px 0;
  .title {
      margin-bottom: 20px;
      font-size: 16px;
  }
}

</style>
