<!--  -->
<template>
  <div>
    <el-dialog
      title="来源分类匹配设置"
      :show-close="false"
      :visible.sync="visible"
      width="35%"
      v-hh-modal
    >
      <div class="left">
        <div class="mb-5 color-333 flex align-c">
          以后复制
          <span class="color-danger align-c ml-10" style="display:inline-flex;">
            <img style="width: 14px; height: 14px;margin-right:2px" :src="getIcon(row)">
            {{ row.source }}
          </span>
        </div>
        <div class="color-primary ml-20">{{ row.origin_category_name }}</div>
        <div class="ml-20">
          分类下的商品，均匹配桑前选择的抖店分类<el-switch
            v-model="is_open"
            class="ml-10"
          ></el-switch>
        </div>
      </div>

      <div class="flex align-c mt-10" style="height: 28px">
        <span class="mr-5">抖店分类:</span>
        <el-button
          size="mini"
          v-if="default_category && !default_category.name"
          @click="chooseCategory"
          class="font-14"
          type="text"
          >点击选择类目</el-button
        >
        <a
          class="skeleton skeleton-item"
          v-if="!default_category"
          style="width: 100px; height: 18px"
        />
        <span
          class="flex align-c font-14"
          style="height: 28px"
          v-if="default_category && default_category.name"
        >
          <el-tooltip
            :content="default_category && default_category.name"
            :disabled="
              default_category.name && default_category.name.length < 18
            "
          >
            <el-button
              size="mini"
              type="text"
              @click="chooseCategory"
              class="brand font-14"
            >
              {{ default_category && default_category.name }}
            </el-button>
          </el-tooltip>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="visible = false" style="width:100px" >取消</el-button>
        <el-button type="primary" @click="confirmDeleteProduct" style="width:100px" >确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="dialog-tight"
      title="选择复制后的类目"
      width="800px"
      center
      :visible.sync="visvileCategory"
      v-hh-modal
    >
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
    },
    getIcon (product) {
      if (product.source === '淘宝') {
        return require('@/assets/images/taobao.png')
      } else if (product.source === '天猫') {
        return require('@/assets/images/tm.png')
      } else if (product.source === '1688') {
        return require('@/assets/images/1688.png')
      } else if (product.source === '京东') {
        return require('@/assets/images/jd.png')
      } else if (product.source === '苏宁') {
        return require('@/assets/images/sn.png')
      } else if (product.source === '网易考拉') {
        return require('@/assets/images/kaola.png')
      } else if (product.source === '唯品会') {
        return require('@/assets/images/vph.png')
      } else if (product.source === '一起做网店17zwd') {
        return require('@/assets/images/17.png')
      } else if (product.source === '抖音') {
        return require('@/assets/images/dy.png')
      } else if (product.source === '拼多多') {
        return require('@/assets/images/pdd.png')
      } else if (product.source === '蝉妈妈') {
        return require('@/assets/images/chanmama.png')
      }
      return ''
    }
  }
}
</script>
<style lang="less" scoped>
</style>
