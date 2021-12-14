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
          <div class="title">
            <div>商品: {{detail.product_name}}</div>
            <div>ID: {{detail.product_id}}</div>
          </div>
          <div v-for="problem in field_problem" :key="problem.field_key">
            <div>
              <span>{{problem.field_name}}</span>
              <span>{{problem.problem_name}}</span>
            </div>
            <div>{{problem.suggestion}}</div>
          </div>
        </div>
        <div v-else class="center">
          此商品没数据
        </div>
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
</style>
