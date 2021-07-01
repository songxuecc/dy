<!--  -->
<template>
    <div>
        <el-dialog
            title="来源分类匹配设置"
            :show-close="false"
            :visible.sync="visible"
            width="35%">
             <div class="left">
              以后复制&nbsp;{{row.source}}&nbsp;{{row.origin_category_name}}分类下的商品，均匹配桑前选择的抖店分类
              <el-switch v-model="is_open"></el-switch>
            </div>

            <div class="flex align-c " style="height:28px">
                <span class="mr-5">类目:</span>
                <el-button size="mini" v-if="default_category && !default_category.name" @click="chooseCategory"
                  type="text">点击选择类目</el-button>
                <a class="skeleton skeleton-item" v-if="!default_category" style="width:100px;height:18px"/>
                <span class="flex align-c" style="height:28px" v-if="default_category && default_category.name">
                  <el-tooltip :content="default_category && default_category.name"
                    :disabled="default_category.name && default_category.name.length < 18">
                    <el-button size="mini" type="text" @click="chooseCategory" class="brand">
                      {{default_category && default_category.name}}</el-button>
                  </el-tooltip>
                </span>
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
      default_category_id: undefined,
      visible: false,
      is_open: true,
      row: {}
    }
  },
  methods: {
    open (row) {
      this.visible = true
      this.row = row
    },
    onChangeCate (category) {
      console.log(category, 'category')
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
