<!--  -->
<template>
    <div>
      <el-dialog
        :visible.sync="visible"
        class="dialog-tight"
        width="50%"
        append-to-body
        center>
        <div v-if="detail.product_id">
          <div class="title mb-10">
            <div>商品: {{detail.product_name}}</div>
            <div>ID: {{detail.product_id}}</div>
            <div>本商品待优化内容{{detail.field_problem.length}}个</div>
          </div>
          <div v-for="(problem,idx) in detail.field_problem" :key="problem.field_key + idx" class="mb-10">
            <div class="color-333 bold ">
              <span>{{problem.problem_name}}</span>
            </div>
            <div class="color-4e">{{problem.suggestion}}</div>
          </div>
        </div>
        <el-table-empty v-else></el-table-empty>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="visible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import servises from '@servises'

export default {
  name: 'ProductScoreDetail',
  props: {
  },
  data () {
    return {
      id: -1,
      visible: false,
      detail: {}
    }
  },
  methods: {
    async open (id) {
      this.id = id
      const data = await servises.productQualityScoreDetail({
        product_id: id
      })
      this.detail = data
      this.visible = true
    },
    handleClose (done) {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
.title {
    font-size: 14px;
    font-weight: bold;
}
</style>
