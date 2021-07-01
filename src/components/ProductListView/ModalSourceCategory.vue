<!--  -->
<template>
    <div>
        <el-dialog
            title="删除复制记录"
            :show-close="false"
            :visible.sync="visible"
            width="30%">
            <p>只删除软件的记录，对小店后台商品没影响，删除后已复制的商品可进行再次复制搬家，您确定要操作吗？</p>

            <div>
                <span>抖店分类</span>
                <span>点击选择类目</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="plain" @click="visible=false">取消</el-button>
                <el-button type="primary" @click="confirmDeleteProduct">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog class="dialog-tight" title="选择复制后的类目" width="800px" center :visible.sync="visvileCategory" v-hh-modal>
            <categorySelectView ref="categorySelectView" @changeCate="onChangeCate" />
        </el-dialog>
    </div>
</template>

<script>
import CategorySelectView from '@/components/CategorySelectView'

export default {
  name: 'ModalSourceCategory',
  props: {
    msg: String
  },
  components: {
    CategorySelectView
  },
  data () {
    return {
      visvileCategory: false,
      default_category: {},
      default_category_id: undefined
    }
  },
  methods: {
    onChangeCate (category) {
      if (!category || (category && !category.id)) {
        return this.$message.error('请选择分类')
      }
      this.visvileCategory = false
      this.default_category = category
      this.default_category_id = category.id
    },
    chooseCategory () {
      this.visvileCategory = true
    },
    removeCategory () {
      this.default_category = {}
      this.default_category_id = 0
    },
    confirmDeleteProduct () {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
