<template>
  <el-form
    :inline="true"
    :model="model"
    class="flex align-c wrap search justify-b"
    size="mini"
    label-position="left"
  >
    <div class="pt-10 ml-10">
        <el-form-item label="修改对象" >
        <el-select v-model="model.editContent" placeholder="请选择修改内容" @change="skuImportSelectChange"  style="width: 220px">
            <el-option label="sku信息: 价格、库存、编码" :value="0"></el-option>
            <el-option label="商品信息: 商品标题" :value="1"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="匹配方式" >
        <el-select v-model="model.matchMethods" placeholder="请选择匹配方式" @change="skuImportSelectChange" style="width: 220px">
            <el-option label="按名称匹配" :value="0"></el-option>
            <el-option label="按ID匹配" :value="1"></el-option>
        </el-select>
        </el-form-item>
    </div>

    <span class="click mr-20" style="align-content:right" @click="openDialogExport">抖店商品导出</span>
    <ModelGoodsExport :dialogExportVisible.sync="dialogExportVisible"/>
  </el-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ModelGoodsExport from './ModelGoodsExport'

export default {
  name: 'Search',
  props: {
    msg: String
  },
  components: {
    ModelGoodsExport
  },
  computed: {
    ...mapState('productManagement/skuImport', ['productSkuExcelFilters']),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/skuImport/fetchRecord']
    })
  },
  data () {
    return {
      dialogExportVisible: false,
      model: {
        editContent: 0,
        matchMethods: 1
      },
      options: new Map([
        [{editContent: 0, matchMethods: 0}, 0],
        [{editContent: 0, matchMethods: 1}, 1],
        [{editContent: 1, matchMethods: 0}, 2],
        [{editContent: 1, matchMethods: 1}, 3]
      ])
    }
  },
  watch: {
  },
  methods: {
    ...mapActions('productManagement/skuImport', ['fetchRecord', 'deleteProductSkuExcelPage']),
    handleFilterChange () {
      let type = 0;
      [...this.options].forEach(item => {
        const [key, value] = item
        if (key.editContent === this.model.editContent && key.matchMethods === this.model.matchMethods) {
          type = value
        }
      })
      this.fetchRecord({
        filters: {
          ...this.productSkuExcelFilters,
          file_type: type
        }
      })
      this.tipTrigger()
    },
    /***
     * 下拉框值变化，更新file_type
     */
    skuImportSelectChange () {
      let type = 0;
      [...this.options].forEach(item => {
        const [key, value] = item
        if (key.editContent === this.model.editContent && key.matchMethods === this.model.matchMethods) {
          type = value
        }
      })
      this.fetchRecord({
        filters: {
          ...this.productSkuExcelFilters,
          file_type: type
        }
      })
    },
    tipTrigger (e) {
      event.stopPropagation()
      const ref = this.$refs.newComer
      if (ref && ref.close) {
        ref.close()
      }
    },
    openDialogExport () {
      this.dialogExportVisible = true
      // 百度统计打点
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '全部商品', '点击', '商品导出'])
      }
    }
  }
}
</script>
<style lang="less" scoped>
.search {
  background-color: #f9f9f9;
  border-radius: 3px;
  margin-bottom: 10px;
  /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 10px;
  }
}
</style>
